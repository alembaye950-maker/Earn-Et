// script.js — landing page helpers

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');

if(menuBtn){
  menuBtn.addEventListener('click', ()=>{
    navLinks.classList.toggle('open');
  });
}

if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Thanks — this is a demo contact form and will not send messages.');
    contactForm.reset();
  });
}
