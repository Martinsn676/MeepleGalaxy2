export function headerTemplate(){return `
<div id="header" class="links-passive flex-row align">    
  <div class="flex-row">
    <a href="../index.html">
      <img class="link-logo" src="https://prototype.meeplegalaxy.com/wp-content/uploads/2023/11/logo_wide_b73121fc-20a9-4cbc-b723-f7f21b51c4ee.png">
    </a>
    <button id="headerLinkButton">Menu</button>
  </div>

    <ul class="headerLinks pc flex-row align">
      <li>
        <a class="" href="../index.html">Home</a>
      </li>
      <li>
        <a class="" href="../page_store/store.html">Store</a>

      </li>
      <li>
          <a class="" href="../page_contact/index.html">Contact</a>
      </li>
      <li>
          <a class="" href="../page_admin/index.html">Admin mode</a>
      </li>
      <li>
        <a class="flex-row align" href='../page_cart/index.html'>
          <img src="/icons/basket.png">
          <span id='cartNumber'>0</span>
        </a>
      </li>
      <li>
        <a class="flex-row align" href='../page_favs/index.html'>
          <img src="/icons/favorites.png">
          <span id='favsNumber'>0</span>
        </a>
      </li>
      <li>
        <button id="testButton">Reset</button>
      </li>
    </ul>

  
  
  
  <div class="headerLinks mobile hide flex-column align-column">
    <a class="homeLink" href="index.html">Home</a>
    <a class="storeLink" href="store.html">Store</a>
    <a class="flex-row align" href='cartPage.html'>Cart</a>
    <a class="contactLink" href="contact.html">Contact</a>
  </div>
</div>
  `
;}