$(function() {
  let client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '200px' });
  client.get('ticket.requester.id').then(function(data) {
    let user_id = data['ticket.requester.id'];
    requestUserInfo(client, user_id);
  });
});

function showInfo(data) {
  let requester_data = {
    'name': data.user.name,
    'tags': data.user.tags,
    'created_at': formatDate(data.user.created_at),
    'last_login_at': formatDate(data.user.last_login_at)
  };

  let source = $("#requester-template").html();
  let template = Handlebars.compile(source);
  let html = template(requester_data);
  $("#content").html(html);
}

function showError(response) {
  let error_data = {
    'status': response.status,
    'statusText': response.statusText
  };

  let source = $("#error-template").html();
  let template = Handlebars.compile(source);
  let html = template(error_data);
  $("#content").html(html);
}

function requestUserInfo(client, id) {
  let settings = {
    url: `/api/v2/users/${id}.json`,
    type: 'GET',
    dataType: 'json'
  };

  client.request(settings).then(
    function(data) {
      showInfo(data);
    },
    function(response) {
      showError(response);
    }
  );
}

function formatDate(date) {
  let cdate = new Date(date);
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  date = cdate.toLocaleDateString("en-us", options);
  return date;
}
