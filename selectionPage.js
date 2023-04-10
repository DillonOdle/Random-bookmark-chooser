addEventListener("DOMContentLoaded", (e) =>{
  let bookmarkTreeNodes = chrome.bookmarks.getTree();
  bookmarkTreeNodes.then(bookmarkTreeNode => {
    bookmarks = bookmarkTreeNode[0];
    populateUI(bookmarks, "All Bookmarks");
  });

  const bookmarksContainer = document.querySelector('#bookmarks-container');
  bookmarksContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains("bookmark-button")) {
      const targetTree = chrome.bookmarks.getSubTree(e.target.dataset.id);
      targetTree.then(tree => {
        const listOfLinks = getListOfLinks(tree[0]);
        if (!Array.isArray(listOfLinks) || !listOfLinks.length) {
          alert(`No links available for ${e.target.innerHTML}`);
          return;
        } else {
          window.open(listOfLinks[(Math.floor(Math.random() * listOfLinks.length))], "_blank");
        }
      });
      
    }
  });
});


function populateUI(bookmark, currentPath) {
  const bookmarksContainer = document.querySelector('#bookmarks-container');
  // If we're at a bookmark instead of a directory
  if (bookmark.url) return;

  // Make bookmark and append it to page
  const bookmarkButton = document.createElement('button');
  bookmarkButton.classList = "bookmark-button";
  bookmarkButton.setAttribute("role", "button");
  bookmarkButton.dataset.id = bookmark.id;
  if (currentPath === "All Bookmarks") {
    bookmarkButton.innerHTML = "All Bookmarks";
  } else if (currentPath === "") {
    bookmarkButton.innerHTML = `${bookmark.title}`;
  } else bookmarkButton.innerHTML = `${currentPath}/${bookmark.title}`;
  //bookmarkContainer.appendChild(title);
  bookmarksContainer.appendChild(bookmarkButton);

  // Recursively make bookmarks for all children
  if(bookmark.children) {
    if (currentPath === "All Bookmarks") currentPath = "";
    else if (currentPath === "") currentPath = `${bookmark.title}`;
    else currentPath = `${currentPath}/${bookmark.title}`;
    bookmark.children.forEach(childNode => {
      populateUI(childNode, currentPath);
    });
  }
}

function getListOfLinks(bookmarkTree) {
  const getAllSubtrees = document.querySelector('#subdirectories-check').checked;
  const currentLinks = []; 
  if (bookmarkTree.children) {
    bookmarkTree.children.forEach(childNode => {
      if (childNode.url) currentLinks.push(childNode.url);
      else if (getAllSubtrees && childNode.children !== 0) currentLinks.push(...getListOfLinks(childNode));
    });
  } else {
    return [];
  }
  return currentLinks;
  
}