const contractAddress ='ct_2qcqwwXmfLmZ3a18yvnv4p8ta9HGoyHRjCDvPMvyAqkuMRwzPD';
var client = null;
var postArray = [];
var postsLength = 0;
  
  function renderPosts() {
  postArray = postArray.sort(function(a,b){return b.votes-a.votes})
  var template = $('#template').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {postArray});
  $('#postBody').html(rendered);
}

//Kaya-Mailo//

async function callStatic(func, args) {
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
  const decodedGet = await calledGet.decode().catch(e => console.error(e));

  return decodedGet;
}

async function contractCall(func, args, value) {
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  const calledSet = await contract.call(func, args, {amount: value}).catch(e => console.error(e));

  return calledSet;
}

//PageLoading...//
window.addEventListener('load', async () => {
	$("#loader").show();
	
	//Mailo//

	  client = await Ae.Aepp();

  postLength = await callStatic('getPostLength', []);

  for (let i = 1; i <= postLength; i++) {

    const post = await callStatic('getPost', [i]);

    postArray.push({
      creatorName: post.name,
      postUrl: post.url,
      index: i,
      votes: post.voteCount,
    })
  }
		
	renderPosts();
		
	$("#loader").hide();
});

 //Voting Here//
jQuery("#postBody").on("click", ".voteBtn", async function(event){
  const value = $(this).siblings('input').val();
  const dataIndex = event.target.id;
  const foundIndex = postArray.findIndex(post => post.index == dataIndex);
  postArray[foundIndex].votes += parseInt(value, 10);
  renderPosts();
});

//Registering Here//
$('#registerBtn').click(async function(){ 
  $("#loader").show(); 
  
  var name = ($('#regName').val()),
      url = ($('#regUrl').val());

  postArray.push({
    creatorName: name,
    postUrl: url,
    index: postArray.length+1,
    votes: 0
  })
  renderPosts();
  $("#loader").hide();
});
