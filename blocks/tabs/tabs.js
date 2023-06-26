import { loadBlocks } from '../../scripts/lib-franklin.js';
import { decorateMain } from '../../scripts/scripts.js';
import { createTag } from '../../scripts/utils/utils.js';

async function generateTabMainBlock(html) {
  const main = createTag('main');
  main.innerHTML = html;
  decorateMain(main);
  await loadBlocks(main);
  return main;
}

const HASH_REGEX = /tabs--(.*)--(.*)/;
const HASH_SCROLL_POLL_INTERVAL_DELAY_IN_MILLI_SECONDS = 20;
function decodeHashToObject() {
  if (!window.location.hash || window.location.hash.length < 3) {
    return null;
  }

  const base = decodeURI(window.location.hash.slice(1));
  const matches = base.match(HASH_REGEX);
  if (matches) {
    return {
      tabMatches: (title, index) => matches[2] === title && parseFloat(matches[1]) === index,
      tabsComponentMatches: (index) => parseFloat(matches[1]) === index,
    };
  }

  return null;
}

function generateHiddenInput(tabSectionIndex, presentTabContents, block) {
  const hashObj = decodeHashToObject();
  for (let i = presentTabContents.length - 1; i > -1; i -= 1) {
    const { tabTitle } = presentTabContents[i].dataset;
    const inputAttrs = {
      type: 'radio', id: `tab-${tabSectionIndex}-${i}`, name: `tabs-${tabSectionIndex}`,
    };
    if (
      (hashObj && hashObj.tabMatches(tabTitle, tabSectionIndex))
        || ((!hashObj || !hashObj.tabsComponentMatches(tabSectionIndex)) && i === 0)
    ) {
      inputAttrs.checked = true;
    }

    const input = createTag('input', inputAttrs);
    block.prepend(input);
  }
}

function generateTabNav(tabSectionIndex, presentTabContents) {
  const ul = createTag('ul', { class: 'tabs-control' });
  presentTabContents.forEach((tabContent, index) => {
    const { tabTitle } = tabContent.dataset;
    const li = createTag('li', { class: 'tab' });
    const label = createTag('label', { for: `tab-${tabSectionIndex}-${index}` });
    const h2 = createTag('h2');
    const a = createTag('a', {}, tabTitle);
    h2.append(a);
    label.append(h2);
    li.append(label);

    li.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      history.replaceState(undefined, undefined, `#tabs--${tabSectionIndex}--${tabTitle}`);
    });

    ul.append(li);
  });
  return ul;
}

export default async function decorate(block) {
  const presentTabContents = [...block.querySelectorAll(':scope > div.contents-wrapper > div.contents')];

  if (presentTabContents && presentTabContents.length > 0) {
    const tabSectionIndex = [...block.closest('main').childNodes].indexOf(block.closest('.section'));

    block.prepend(generateTabNav(tabSectionIndex, presentTabContents));
    generateHiddenInput(tabSectionIndex, presentTabContents, block);

    const hashObj = decodeHashToObject();

    const promises = presentTabContents.map(async (contents) => {
      const tabMainBlock = await generateTabMainBlock(contents.innerHTML);
      if (tabMainBlock) {
        const fragmentSection = tabMainBlock.querySelector(':scope .section');
        if (fragmentSection) {
          const section = block.closest('.section');
          const cssClasses = [...fragmentSection.classList].filter((val) => val !== 'two-columns');
          section.classList.add(...cssClasses);
        }
        if (hashObj && hashObj.tabMatches(contents.dataset.tabTitle, tabSectionIndex)) {
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(false);
    });

    const results = await Promise.all(promises);
    if (results.indexOf(true) > -1) {
      const section = block.closest('.section');

      const pollInterval = window.setInterval(() => {
        if (section.style.display !== 'none') {
          window.clearInterval(pollInterval);
          block.scrollIntoView();
        }
      }, HASH_SCROLL_POLL_INTERVAL_DELAY_IN_MILLI_SECONDS);
    }
  }
}
