const contractAddress ='ct_JS1JFe3zQuZMsfgi4Svrp1WgNPv3edjS5WSe9xkkBPbTYCRC8';
var client = null;
var postArray = [];
var postLength = 0;

function renderPosts() {
  postArray = postArray.sort(function(a,b){return b.votes-a.votes})
  var template = $('#template').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {postArray});
  $('#postBody').html(rendered);
}

async function callStatic(func, args, types) {
  const calledGet = await client.contractCallStatic(contractAddress,
  'sophia-address', func, {args}).catch(e => console.error(e));

  const decodedGet = await client.contractDecodeData(types,
  calledGet.result.returnValue).catch(e => console.error(e));

  return decodedGet;
}

async function contractCall(func, args, value, types) {
  const calledSet = await client.contractCall(contractAddress, 'sophia-address',
  contractAddress, func, {args, options: {amount:value}}).catch(async e => {
    const decodedError = await client.contractDecodeData(types,
    e.returnValue).catch(e => console.error(e));
  });

  return
}


window.addEventListener('load', async () => {
  $("#loader").show();

  client = await Ae.Aepp();

  const getPostLength = await callStatic('getPostLength','()','int');
  postLength = getPostLength.value;

  for (let i = 1; i <= postLength; i++) {
    const post = await callStatic('getPost',`(${i})`,'(address, string, string, int)');

    postArray.push({
      postBy: post.value[2].value,
      postUrl: post.value[1].value,
      index: i,
      votes: post.value[3].value,
    })
  }

  renderPosts();

  $("#loader").hide();
});

jQuery("#postBody").on("click", ".voteBtn", async function(event){
  $("#loader").show();

  const value = $(this).siblings('input').val();
  const dataIndex = event.target.id;

  await contractCall('votePost',`(${dataIndex})`,value,'(int)');

  const foundIndex = postArray.findIndex(post => post.index == dataIndex);
  postArray[foundIndex].votes += parseInt(value, 10);

  renderPosts();

  $("#loader").hide();
});

$('#registerBtn').click(async function(){
  $("#loader").show();

  const name = ($('#regName').val()),
        url = ($('#regUrl').val());

  await contractCall('registerPost',`("${url}","${name}")`,0,'(int)');

  postArray.push({
    postBy: name,
    postUrl: url,
    index: postArray.length+1,
    votes: 0
  })

  renderPosts();

  $("#loader").hide();
});
