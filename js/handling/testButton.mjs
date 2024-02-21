
async function testAddToCart(){

  //[217,1],[214,1] [[225,1],[221,1],[214,1],[250,1,225,40],[248,1,225,50],[250,1,221,40],[248,1,221,50]]
  localStorage.clear()
  const cartTestingGames = [[250,1,318,76],[318,1],[319,1,318]]
  const favsTestingGames = [[225,1],[217,1],[214,1]]
  localStorage.setItem('cart', JSON.stringify(cartTestingGames));
  localStorage.setItem('favs', JSON.stringify(favsTestingGames));
  
}

export {testAddToCart}