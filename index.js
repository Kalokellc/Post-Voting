const contractAddress ='ct_2qcqwwXmfLmZ3a18yvnv4p8ta9HGoyHRjCDvPMvyAqkuMRwzPD';
var client = null;
var postArray = [];
var postLength = 0;

//RENDER MEME//  
  function renderPosts() {
  postArray = postArray.sort(function(a,b){return b.votes-a.votes})
  var template = $('#template').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {postArray});
  $('#postBody').html(rendered);
}

//EXECUTE FUNCTIONS//
window.addEventListener('load', async () => {
  
  $("#loader").show();

  client = await Ae.Aepp();
  
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  const calledGet = await contract.call('getpostLength', [], {callStatic: true}).catch(e => console.error(e));
  console.log('calledGet', calledGet);

  const decodedGet = await calledGet.decode().catch(e => console.error(e));
  console.log('decodedGet', decodedGet);

  renderPosts();
  
  $("#loader").hide();
});

 //VOTE HERE//
jQuery("#postBody").on("click", ".voteBtn", async function(event){
  const value = $(this).siblings('input').val();
  const dataIndex = event.target.id;
  const foundIndex = postArray.findIndex(post => post.index == dataIndex);
  postArray[foundIndex].votes += parseInt(value, 10);
  renderPosts();
});

//REGISTER HERE//
$('#registerBtn').click(async function(){ 
  
  var name = ($('#regName').val()),
      url = ($('#regUrl').val());

  postArray.push({
    creatorName: name,
    postUrl: url,
    index: postArray.length+1,
    votes: 0
  })
  renderPosts();
});
