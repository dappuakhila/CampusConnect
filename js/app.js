const $ = id => document.getElementById(id);

const starterData = {
  attendance: [
    {subject:"Web Technologies", attended:18, total:20},
    {subject:"Data Mining", attended:16, total:20},
    {subject:"Computer Networks", attended:19, total:20},
    {subject:"Software Engineering", attended:17, total:20}
  ],
  timetable: [
    {time:"09:00 – 10:00", subject:"Web Technologies", room:"Lab 2", day:"Monday"},
    {time:"10:00 – 11:00", subject:"Data Mining", room:"Room 304", day:"Monday"},
    {time:"11:15 – 12:15", subject:"Computer Networks", room:"Room 201", day:"Monday"},
    {time:"01:00 – 02:00", subject:"Software Engineering", room:"Room 305", day:"Monday"},
    {time:"09:00 – 10:00", subject:"Python Programming", room:"Lab 1", day:"Tuesday"}
  ],
  assignments: [
    {title:"HTML & CSS Mini Project", due:"2026-11-08", status:"Pending", subject:"Web Technologies"},
    {title:"Data Mining Case Study", due:"2026-11-10", status:"Submitted", subject:"Data Mining"}
  ],
  announcements: [
    {title:"Internal assessment schedule", detail:"The internal assessment timetable will be shared soon.", date:"Today"},
    {title:"Project review", detail:"Students should keep their project demonstration ready.", date:"Yesterday"}
  ],
  events: [
    {title:"Tech Fest 2026", date:"2026-11-12", place:"Main Auditorium", description:"Technical events, project expo and coding contests."},
    {title:"Web Development Workshop", date:"2026-11-16", place:"Computer Lab 2", description:"Hands-on HTML, CSS and JavaScript workshop."}
  ],
  notes: [
    {title:"UID project ideas", body:"Prepare the project explanation and screenshots."}
  ]
};

let data = JSON.parse(localStorage.getItem("cc_data") || "null") || starterData;
for (const key of Object.keys(starterData)) if (!Array.isArray(data[key])) data[key] = starterData[key];
let currentPage = "dashboard";

function save(){ localStorage.setItem("cc_data", JSON.stringify(data)); }
function profile(){
  return JSON.parse(localStorage.getItem("cc_profile") || "null") ||
    {name:"Akhila Dappu", roll:"24WH1A05U6", dept:"CSE", email:"student@college.edu"};
}
function safe(value){
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function showApp(){
  const p = profile();
  $("loginView").classList.add("hidden");
  $("appView").classList.remove("hidden");
  $("sideName").textContent = p.name;
  $("sideRoll").textContent = p.roll + " · " + p.dept;
  $("avatar").textContent = p.name.charAt(0).toUpperCase();
  $("topAvatar").textContent = p.name.charAt(0).toUpperCase();
  $("welcomeTitle").textContent = "Welcome back, " + p.name.split(" ")[0] + "!";
  render(currentPage);
}
function go(page){
  currentPage = page;
  document.querySelectorAll(".nav").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  render(page);
}
$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  localStorage.setItem("cc_profile", JSON.stringify({
    name:$("studentName").value.trim(), roll:$("rollNumber").value.trim(),
    dept:$("department").value, email:$("studentEmail")?.value.trim() || "student@college.edu"
  }));
  showApp();
});
$("logoutBtn").addEventListener("click", () => {
  $("appView").classList.add("hidden");
  $("loginView").classList.remove("hidden");
});
document.querySelectorAll(".nav").forEach(b => b.addEventListener("click", () => go(b.dataset.page)));

const percent = x => x.total ? Math.round(x.attended / x.total * 100) : 0;
function attendancePercent(){
  const a = data.attendance.reduce((s,x)=>s+x.attended,0);
  const t = data.attendance.reduce((s,x)=>s+x.total,0);
  return t ? Math.round(a/t*100) : 0;
}
function heading(title, subtitle){
  return `<div class="page-heading"><h2>${title}</h2><p>${subtitle}</p></div>`;
}
function render(page){
  const area = $("pageContent");
  if(page === "dashboard"){
    area.innerHTML = `
      <div class="welcome-card"><h3>Your campus, at a glance.</h3><p>Track classes, academic progress, activities and personal study notes in one place.</p></div>
      <div class="grid">
        <div class="stat"><small>Attendance</small><strong>${attendancePercent()}%</strong><span>Overall attendance</span></div>
        <div class="stat"><small>Subjects</small><strong>${data.attendance.length}</strong><span>Currently enrolled</span></div>
        <div class="stat"><small>Pending assignments</small><strong>${data.assignments.filter(x=>x.status==="Pending").length}</strong><span>Need your attention</span></div>
        <div class="stat"><small>Campus events</small><strong>${data.events.length}</strong><span>Upcoming activities</span></div>
      </div>
      <div class="two-col">
        <div class="panel"><h3>Today's timetable</h3>${data.timetable.slice(0,4).map(x=>`<div class="row-item"><div><b>${safe(x.subject)}</b><small>${safe(x.time)} · ${safe(x.day)}</small></div><span class="tag">${safe(x.room)}</span></div>`).join("")}</div>
        <div class="panel"><h3>Latest announcements</h3>${data.announcements.slice(0,4).map(x=>`<div class="row-item"><div><b>${safe(x.title)}</b><small>${safe(x.detail)}</small></div><span class="tag">${safe(x.date)}</span></div>`).join("")}</div>
      </div>
      <div class="two-col">
        <div class="panel"><h3>Upcoming events</h3>${data.events.slice(0,3).map(x=>`<div class="row-item"><div><b>${safe(x.title)}</b><small>${safe(x.date)} · ${safe(x.place)}</small></div><span class="tag green">Event</span></div>`).join("") || '<p class="empty">No events added.</p>'}</div>
        <div class="panel"><h3>Quick actions</h3><div class="quick-actions"><button data-go="assignments">View assignments</button><button data-go="events">Explore events</button><button data-go="notes">Open my notes</button></div></div>
      </div>`;
  } else if(page === "attendance"){
    area.innerHTML = heading("Attendance","Your subject-wise attendance record.") + `
      <div class="panel"><div class="attendance-summary"><b>Overall attendance: ${attendancePercent()}%</b><span class="muted">Target: 75% minimum</span></div>
      <table class="table"><thead><tr><th>Subject</th><th>Attended</th><th>Total classes</th><th>Percentage</th><th>Action</th></tr></thead>
      <tbody>${data.attendance.map((x,i)=>`<tr><td>${safe(x.subject)}</td><td>${x.attended}</td><td>${x.total}</td><td><span class="tag ${percent(x)>=75?"green":"orange"}">${percent(x)}%</span></td><td><button class="mini-btn" data-attend="${i}">Mark present</button></td></tr>`).join("")}</tbody></table>
      <p class="hint">Demo action: Mark present adds one attended class and one total class.</p></div>`;
  } else if(page === "timetable"){
    area.innerHTML = heading("Timetable","Your class schedule. Add or remove demo class entries.") + `
      <div class="panel"><form id="classForm" class="action-form wrap-form">
        <input id="classSubject" placeholder="Subject name" required><input id="classTime" placeholder="Time (e.g. 02:00 – 03:00)" required>
        <input id="classRoom" placeholder="Room / Lab" required><select id="classDay"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select>
        <button type="submit">Add class</button></form>
      <table class="table"><thead><tr><th>Day</th><th>Time</th><th>Subject</th><th>Location</th><th></th></tr></thead><tbody>
      ${data.timetable.map((x,i)=>`<tr><td>${safe(x.day||"Monday")}</td><td>${safe(x.time)}</td><td>${safe(x.subject)}</td><td>${safe(x.room)}</td><td><button class="mini-btn danger" data-delclass="${i}">Delete</button></td></tr>`).join("")}</tbody></table></div>`;
    $("classForm").addEventListener("submit",e=>{e.preventDefault();data.timetable.push({subject:$("classSubject").value,time:$("classTime").value,room:$("classRoom").value,day:$("classDay").value});save();render(page)});
    area.querySelectorAll("[data-delclass]").forEach(b=>b.onclick=()=>{data.timetable.splice(+b.dataset.delclass,1);save();render(page)});
  } else if(page === "assignments"){
    area.innerHTML = heading("Assignments","Add assignments and update their submission status.") + `
      <div class="panel"><form id="assignmentForm" class="action-form wrap-form">
        <input id="assignmentTitle" placeholder="Assignment title" required><input id="assignmentSubject" placeholder="Subject" required><input id="assignmentDue" type="date" required><button type="submit">Add assignment</button></form>
      ${data.assignments.map((x,i)=>`<div class="row-item"><div><b>${safe(x.title)}</b><small>${safe(x.subject||"General")} · Due: ${safe(x.due)}</small></div><div class="inline-actions"><button class="tag ${x.status==="Submitted"?"green":"orange"}" data-submit="${i}">${x.status==="Submitted"?"Submitted · Undo":"Mark submitted"}</button><button class="mini-btn danger" data-delassignment="${i}">Delete</button></div></div>`).join("") || '<p class="empty">No assignments yet.</p>'}</div>`;
    $("assignmentForm").addEventListener("submit",e=>{e.preventDefault();data.assignments.push({title:$("assignmentTitle").value,subject:$("assignmentSubject").value,due:$("assignmentDue").value,status:"Pending"});save();render(page)});
    area.querySelectorAll("[data-submit]").forEach(b=>b.onclick=()=>{const x=data.assignments[+b.dataset.submit];x.status=x.status==="Submitted"?"Pending":"Submitted";save();render(page)});
    area.querySelectorAll("[data-delassignment]").forEach(b=>b.onclick=()=>{data.assignments.splice(+b.dataset.delassignment,1);save();render(page)});
  } else if(page === "announcements"){
    area.innerHTML = heading("Announcements","Campus notices and important updates.") + `
      <div class="panel">${data.announcements.map((x,i)=>`<div class="row-item"><div><b>${safe(x.title)}</b><small>${safe(x.detail)}</small></div><div class="inline-actions"><span class="tag">${safe(x.date)}</span><button class="mini-btn danger" data-delnotice="${i}">Delete</button></div></div>`).join("") || '<p class="empty">No announcements yet.</p>'}</div>
      <div class="panel form-panel"><h3>Post a demo announcement</h3><form id="noticeForm" class="action-form wrap-form"><input id="noticeTitle" placeholder="Announcement title" required><input id="noticeDetail" placeholder="Announcement details" required><button type="submit">Publish notice</button></form></div>`;
    $("noticeForm").addEventListener("submit",e=>{e.preventDefault();data.announcements.unshift({title:$("noticeTitle").value,detail:$("noticeDetail").value,date:"Just now"});save();render(page)});
    area.querySelectorAll("[data-delnotice]").forEach(b=>b.onclick=()=>{data.announcements.splice(+b.dataset.delnotice,1);save();render(page)});
  } else if(page === "events"){
    area.innerHTML = heading("Campus Events","Discover workshops, fests and college activities.") + `
      <div class="panel"><h3>Add a campus event</h3><form id="eventForm" class="action-form wrap-form"><input id="eventTitle" placeholder="Event name" required><input id="eventDate" type="date" required><input id="eventPlace" placeholder="Venue" required><input id="eventDesc" placeholder="Short description" required><button type="submit">Add event</button></form></div>
      <div class="event-grid">${data.events.map((x,i)=>`<article class="event-card"><span class="tag green">${safe(x.date)}</span><h3>${safe(x.title)}</h3><p>${safe(x.description)}</p><small>⌖ ${safe(x.place)}</small><button class="mini-btn danger" data-delevent="${i}">Remove event</button></article>`).join("") || '<p class="empty">No events yet. Add one above.</p>'}</div>`;
    $("eventForm").addEventListener("submit",e=>{e.preventDefault();data.events.push({title:$("eventTitle").value,date:$("eventDate").value,place:$("eventPlace").value,description:$("eventDesc").value});save();render(page)});
    area.querySelectorAll("[data-delevent]").forEach(b=>b.onclick=()=>{data.events.splice(+b.dataset.delevent,1);save();render(page)});
  } else if(page === "notes"){
    area.innerHTML = heading("My Notes","Save quick study notes in this browser.") + `
      <div class="panel"><form id="noteForm" class="note-form"><input id="noteTitle" placeholder="Note title" required><textarea id="noteBody" placeholder="Write your note here..." required></textarea><button type="submit">Save note</button></form></div>
      <div class="notes-grid">${data.notes.map((x,i)=>`<article class="note-card"><h3>${safe(x.title)}</h3><p>${safe(x.body)}</p><button class="mini-btn danger" data-delnote="${i}">Delete note</button></article>`).join("") || '<p class="empty">No notes saved yet.</p>'}</div>`;
    $("noteForm").addEventListener("submit",e=>{e.preventDefault();data.notes.unshift({title:$("noteTitle").value,body:$("noteBody").value});save();render(page)});
    area.querySelectorAll("[data-delnote]").forEach(b=>b.onclick=()=>{data.notes.splice(+b.dataset.delnote,1);save();render(page)});
  } else if(page === "profile"){
    const p=profile();
    area.innerHTML = heading("My Profile","View and update your student information.") + `
      <div class="panel profile-form-panel"><form id="profileForm" class="profile-form">
      <label>Full name<input id="editName" value="${safe(p.name)}" required></label>
      <label>College email<input id="editEmail" type="email" value="${safe(p.email||"")}" required></label>
      <label>Roll number<input id="editRoll" value="${safe(p.roll)}" required></label>
      <label>Department<select id="editDept">${["CSE","IT","ECE","EEE","AI & DS"].map(d=>`<option ${p.dept===d?"selected":""}>${d}</option>`).join("")}</select></label>
      <button class="primary" type="submit">Save profile</button></form></div>`;
    $("profileForm").addEventListener("submit",e=>{e.preventDefault();localStorage.setItem("cc_profile",JSON.stringify({name:$("editName").value,roll:$("editRoll").value,dept:$("editDept").value,email:$("editEmail").value}));showApp();go("profile");});
  }
  area.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
  area.querySelectorAll("[data-attend]").forEach(b=>b.addEventListener("click",()=>{const x=data.attendance[+b.dataset.attend];x.attended++;x.total++;save();render(page)}));
}
$("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("cc_dark",document.body.classList.contains("dark")?"1":"0")});
if(localStorage.getItem("cc_dark")==="1") document.body.classList.add("dark");
window.addEventListener("storage",e=>{
  if(e.key==="cc_data"){data=JSON.parse(e.newValue||"{}");for(const k of Object.keys(starterData))if(!Array.isArray(data[k]))data[k]=starterData[k];render(currentPage)}
  if(e.key==="cc_profile")showApp();
});
if(localStorage.getItem("cc_profile")) showApp();
