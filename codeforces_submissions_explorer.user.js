// ==UserScript==
// @name         Codeforces Submissions Explorer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   Introduces a user-friendly button for displaying submissions/solutions to problems in problemset/contests from all users, sorted by submission time.
// @author       khanxbahria
// @match        https://codeforces.com/contest/*
// @match        https://codeforces.com/problemsets/*
// @match        https://codeforces.com/problemset*
// @match        https://codeforces.com/problemset/problem/*
// @grant        none
// ==/UserScript==

"use strict";

const order = 'BY_ARRIVED_ASC';

// Modify the all submissions/status link in problems table in problemset/contest
// to sort problems by submission time
const modifyAllSubmissionsLinksProblemsList = () => {
    const allSubmissionsLinks = document.querySelectorAll('.problems tbody tr td.right a');
    allSubmissionsLinks.forEach(link => {
        link.href += `?order=${order}`;
    });
};

// Add a button in menubar to show submissions from all users sorted by submission time
const addAllSubmissionsLink = () => {
    const envType = getEnvTypeFromUrl();
    const problemID = getProblemIdFromUrl();
    const contestID = getContestIdFromUrl();
    let allSubmissionsLink = null;

    if(contestID===null || problemID === null) return;
    if(envType[0] === 'contest') {
        allSubmissionsLink = `/contest/${contestID}/status/${problemID}?order=${order}`;
    } else if(envType[0] === 'problemset') {
        allSubmissionsLink = `/problemset/status/${contestID}/problem/${problemID}?order=${order}`;
    } else if(envType[0] === 'problemsets') {
        allSubmissionsLink = `/problemsets/${envType[1]}/status/${contestID}/problem/${problemID}?order=${order}`;
    }
    if(allSubmissionsLink!==null) {
        addMenuItem("All Submissions", allSubmissionsLink);
    }
};

// Extract problem ID from the current URL like A or B or C
const getProblemIdFromUrl = () => {
  const url = new URL(window.location.href);
  const path = url.pathname.split('/');
  const problemId = path[path.length - 1];
  return problemId;
};

// Extract contest ID from the current URL like 1830, 1836
const getContestIdFromUrl = () => {
  const url = new URL(window.location.href);
  const pathSegments = url.pathname.split('/');
  let contestIdIndex = -1;
  for (let i = 0; i < pathSegments.length; i++) {
    if (pathSegments[i] === 'contest') {
      contestIdIndex = i + 1;
      break;
    }
    if (pathSegments[i] === 'problemset') {
      contestIdIndex = i + 2;
      break;
    }
    if (pathSegments[i] === 'problemsets') {
      contestIdIndex = i + 3;
      break;
    }
  }
  if (contestIdIndex !== -1 && contestIdIndex < pathSegments.length) {
    return pathSegments[contestIdIndex];
  }
  return null;
};

// Extract environment type where the problem is located from
// Possible return values:
// ['contest']
// ['problemset']
// ['problemsets', {probelmset_name}]
const getEnvTypeFromUrl = () => {
  const url = new URL(window.location.href);
  const pathSegments = url.pathname.split('/');
  for (let i = 0; i < pathSegments.length; i++) {
    if (pathSegments[i] === 'contest') {
      return [pathSegments[i]];
    }
    if (pathSegments[i] === 'problemset') {
      return [pathSegments[i]];
    }
    if (pathSegments[i] === 'problemsets') {
      return [pathSegments[i], pathSegments[i+1]];
    }
  }
};

// Add a button to the menu bar
const addMenuItem = (label, link) => {
    const menubar = document.querySelector("#pageContent > div.second-level-menu > ul");
    menubar.innerHTML += `<li><a href="${link}" target="_blank">${label}</a></li>\n`
};

const main = () => {
    modifyAllSubmissionsLinksProblemsList();
    addAllSubmissionsLink();
};

main();