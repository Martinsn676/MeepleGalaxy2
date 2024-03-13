export const sortObject = {
  'titleAsc': ['orderby=title&order=asc', 'title-az', 'Title Az'],
  'titleDesc': ['orderby=title&order=desc', 'title-za', 'Title Za'],
  'dateAsc': ['orderby=date&order=asc', 'title-oldest', 'Oldest'],
  'dateDesc': ['orderby=date&order=desc', 'title-newest', 'Newest'],
  addButtons(details) {
    this.sortDetails =  [this.titleAsc,this.titleDesc,this.dateAsc,this.dateDesc]
    this.sortDetails.forEach(sort => {
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('bordered', 'sort-button', sort[1]);
      button.textContent = sort[2];
      button.id = sort[1];
      button.disabled = true;

      details.mainContainer.querySelector(".sort-buttons").appendChild(button);

    });
      this.findActive(details)
  },
  changeSort(event){
    const sortFound = this.sortDetails.find((sortOption)=>sortOption[2]===event.target.innerText)
    return sortFound
  },

  findActive({mainContainer,sort}){
    const allSorts = mainContainer.querySelectorAll('.sort-button')
    allSorts.forEach((button)=>button.classList.remove('selected-sort'))
    const selectedSort = mainContainer.querySelector(`#${sort[1]}`)
    selectedSort.classList.add("selected-sort")
  }
};
