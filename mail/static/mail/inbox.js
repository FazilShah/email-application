document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_archive('sent'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  document.querySelector('#archive').style.display = 'none';
  document.querySelector('#unarchive').style.display = 'none';
  document.querySelector('#reply').style.display = 'none';
  

  // By default, load the inbox
  load_mailbox('inbox');
});

function load_archive(mailbox) {

  document.querySelector('#archive').style.display = 'none';
  document.querySelector('#unarchive').style.display = 'none';
  

  

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(mail => {

      console.log(mail);

      if(`${mail.archived}` === 'true'){
      

      const element01 = document.createElement('div');
      element01.style.borderStyle = 'solid';
      element01.style.borderCollapse = 'collapse';
      const element = document.createElement('h4');
      element.innerHTML = `${mail.recipients}`;
      element01.append(element);
      const element2 = document.createElement('h5');
      element2.innerHTML = `${mail.subject}`;
      element01.append(element2);
      subject = document.createElement('p');
      subject.innerHTML = `${mail.timestamp}`;
      element01.append(subject);
      element01.addEventListener('click', () => view_mail(`${mail.id}`, mail.archived));
    
      
  
  
      if(`${mail.read}` === 'false'){
        element01.style.backgroundColor = 'gray';
      } 
      else {
        element01.style.backgroundColor = 'white';

      }

      document.querySelector("#archive-view").append(element01);
      

      
    }
      
      
    });
  });
  
  // Show the mailbox and hide other views
  document.querySelector('#archive-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';
  
  
  

  // Show the mailbox name
  
  document.querySelector('#archive-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
}



function compose_email(a='', b='', c='') {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = a;
  document.querySelector('#compose-subject').value = b;
  document.querySelector('#compose-body').value = c;
}

function load_mailbox(mailbox) {

  document.querySelector('#archive').style.display = 'none';
  document.querySelector('#unarchive').style.display = 'none';
  

  

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(mail => {

      console.log(mail);
      
      if(`${mail.archived}` === 'false'){

      const element0 = document.createElement('div');
      element0.style.borderStyle = 'solid';
      element0.style.borderCollapse = 'collapse';
      const element = document.createElement('h4');
      element.innerHTML = `${mail.recipients}`;
      element0.append(element);
      const element2 = document.createElement('h5');
      element2.innerHTML = `${mail.subject}`;
      element0.append(element2);
      subject = document.createElement('p');
      subject.innerHTML = `${mail.timestamp}`;
      element0.append(subject);
      element0.addEventListener('click', () => view_mail(`${mail.id}`, mail.archived));
  
  
      if(`${mail.read}` === 'false'){
        element0.style.backgroundColor = 'gray';
      } 
      else {
        element0.style.backgroundColor = 'white';
      }

      

      

      document.querySelector("#emails-view").append(element0);

    }
    
    

      
    });
  });
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';
  document.querySelector('#archive-view').style.display = 'none';
  
  
  

  // Show the mailbox name
  
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
}


function view_mail(id, archive) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(mail => {
    

    subject11 = `Re: ${mail.subject}`;
    reply11 = `${mail.recipients}`;
    body11 = `On ${mail.timestamp} ${mail.recipients} wrote: ${mail.body}`

    const div = document.createElement('div');
    const sub = document.createElement('h4');
    sub.innerHTML = `${mail.subject}`;
    div.append(sub);
    const time = document.createElement('p');
    time.innerHTML = `${mail.timestamp}`;
    div.append(time);
    const body = document.createElement('p');
    body.innerHTML = `${mail.body}`;
    div.append(body);

    
    document.querySelector('#email-detail').innerHTML = div.innerHTML;
    

    document.querySelector('#email-detail').style.display = 'block';
    




  })

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  })


  if(archive === false){

    document.querySelector('#archive').style.display = 'block';
    document.querySelector('#unarchive').style.display = 'none';
    document.querySelector('#reply').style.display = 'block';
    document.querySelector('#archive').addEventListener('click', () => {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
        })
      })
      load_mailbox('inbox')
    })

    document.querySelector('#reply').addEventListener('click', () => {
      document.querySelector('#email-detail').style.display = 'none';
      document.querySelector('#reply').style.display = 'none';
      document.querySelector('#archive').style.display = 'none';
      compose_email(reply11, subject11, body11);
    })
  }
  else if(archive === true) {
    document.querySelector('#unarchive').style.display = 'block';
    document.querySelector('#archive').style.display = 'none';
    document.querySelector('#unarchive').addEventListener('click', () => {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false
        })
      })
      load_mailbox('inbox')
    })
  }


  




}


function send_email(event) {

  event.preventDefault();

  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    })
  })
    // Take the return data and parse it in JSON format.
    .then(response => response.json())
    .then(result => {
          console.log(result)


  
    })
    .catch((error) => console.log(error));
}





