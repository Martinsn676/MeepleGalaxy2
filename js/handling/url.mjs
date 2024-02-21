function getUrlId(){
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  const numberID = parseInt(id, 10);
  return numberID
}
export{getUrlId}