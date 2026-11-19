const api = "https://api.github.com/repos/matraic/m3e";
const github = "https://github.com/matraic/m3e";
const container = document.querySelector("#releases");
const status = document.querySelector("#release-status");
const loadButton = document.querySelector("#load-releases");
const releases = [];
let nextPage = 1;
let hasMore = true;
let visibleCount = 0;

async function request(path) {
  const response = await fetch(`${api}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error("GitHub is limiting requests. Please try again later or view the history on GitHub.");
    }
    throw new Error(`GitHub returned HTTP ${response.status}. Please try again.`);
  }
  return {
    data: await response.json(),
    hasNext: /rel="next"/.test(response.headers.get("link") ?? ""),
  };
}

function errorMessage(error) {
  return error instanceof Error ? error.message : "Unable to load data from GitHub. Please try again.";
}

async function setLoadingVisible(target, indicator, visible, onReady) {
  const labels = [...target.querySelectorAll(".release-label")];
  const edge = getComputedStyle(target).direction === "rtl" ? "right" : "left";
  const positions = labels.map((label) => label.getBoundingClientRect()[edge]);
  if (visible) {
    target.append(indicator);
  } else {
    indicator.remove();
  }
  if (!labels.length || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onReady?.();
    return;
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));
  const animations = labels.map((label, index) => {
    const offset = positions[index] - label.getBoundingClientRect()[edge];
    return label.animate([{ transform: `translateX(${offset}px)` }, { transform: "translateX(0)" }], {
      duration: 350,
      easing: "cubic-bezier(0.27, 1.06, 0.18, 1)",
    });
  });
  onReady?.();
  await Promise.allSettled(animations.map((animation) => animation.finished));
}

function showLoading(target, label, slot) {
  const indicator = document.createElement("m3e-loading-indicator");
  indicator.className = "loading";
  indicator.setAttribute("aria-label", label);
  if (slot) indicator.slot = slot;
  let shownAt;
  const timer = setTimeout(async () => {
    shownAt = performance.now();
    await setLoadingVisible(target, indicator, true);
  }, 200);

  return async (onReady) => {
    clearTimeout(timer);
    if (shownAt !== undefined) {
      const remaining = 500 - (performance.now() - shownAt);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
    }
    if (shownAt !== undefined) {
      await setLoadingVisible(target, indicator, false, onReady);
    } else {
      onReady?.();
    }
  };
}

async function loadCommits(content, release, previousRelease, retryLoading) {
  const message = document.createElement("p");
  message.setAttribute("role", "status");
  content.replaceChildren();
  try {
    const tag = encodeURIComponent(release.tag_name);
    const comparison = previousRelease ? `${encodeURIComponent(previousRelease.tag_name)}...${tag}` : null;
    const commits = [];
    let page = 1;
    let hasNext;
    do {
      const result = await request(
        comparison
          ? `/compare/${comparison}?per_page=100&page=${page}`
          : `/commits?sha=${tag}&per_page=100&page=${page}`,
      );
      commits.push(...(comparison ? result.data.commits : result.data));
      hasNext = result.hasNext;
      page++;
    } while (hasNext);

    const hasDocumentationCommits = commits.some((commit) => /^docs(?:\([^)]*\))?!?:/i.test(commit.commit.message));
    const changes = commits.filter(
      (commit) => !/^(?:chore|test|docs|refactor|release)(?:\([^)]*\))?!?:/i.test(commit.commit.message),
    );
    const list = document.createDocumentFragment();
    for (const commit of changes) {
      const action = document.createElement("m3e-list-action");
      action.textContent = commit.commit.message.split(/\r?\n/)[0];
      action.setAttribute("href", `${github}/commit/${encodeURIComponent(commit.sha)}`);
      action.setAttribute("target", "_blank");
      action.setAttribute("rel", "noopener noreferrer");
      list.append(action);
    }
    if (changes.length) {
      content.replaceChildren(list);
    } else {
      message.textContent = hasDocumentationCommits
        ? "Documentation updates only for this release."
        : "No changes to display for this release.";
      content.replaceChildren(message);
    }
    return true;
  } catch (error) {
    console.error("Failed to load release commits:", error);
    message.textContent = errorMessage(error);
    const retry = document.createElement("m3e-button");
    retry.setAttribute("variant", "outlined");
    retry.textContent = "Retry";
    retry.addEventListener("click", () => retryLoading(), { once: true });
    content.replaceChildren(message, retry);
    return false;
  }
}

function createRelease(release, previousRelease) {
  const item = document.createElement("m3e-expandable-list-item");
  item.className = "release";
  const title = document.createElement("span");
  title.className = "release-label";
  title.textContent = `${release.name || release.tag_name}${release.prerelease ? " (Pre-release)" : ""}`;
  item.append(title);
  if (release.published_at) {
    const date = document.createElement("time");
    date.className = "release-label";
    date.slot = "supporting-text";
    date.dateTime = release.published_at;
    date.textContent = new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: "long" }).format(
      new Date(release.published_at),
    );
    item.append(date);
  }
  const content = document.createElement("div");
  content.className = "release-content";
  content.slot = "items";
  item.append(content);
  let ready = false;
  let loading = false;

  async function loadAndExpand(initial = false) {
    if (loading) return;
    loading = true;
    item.removeAttribute("open");
    item.setAttribute("aria-busy", "true");
    const finishLoading = initial
      ? undefined
      : showLoading(item, `Loading changes for ${release.name || release.tag_name}`, "leading");
    try {
      await loadCommits(content, release, previousRelease, loadAndExpand);
      await customElements.whenDefined("m3e-expandable-list-item");
      await item.updateComplete;
      ready = true;
      if (finishLoading) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await finishLoading(() => item.setAttribute("open", ""));
      }
    } finally {
      item.removeAttribute("aria-busy");
      loading = false;
    }
  }

  item.addEventListener(
    "click",
    (event) => {
      if (
        event.defaultPrevented ||
        (ready && !loading) ||
        (event.target instanceof Node && content.contains(event.target))
      ) {
        return;
      }
      event.preventDefault();
      loadAndExpand();
    },
    { capture: true },
  );
  return { item, load: loadAndExpand };
}

async function loadReleases() {
  const initialLoad = visibleCount === 0;
  if (initialLoad) container.replaceChildren();
  loadButton.disabled = true;
  status.replaceChildren();
  const finishLoading = showLoading(status, "Loading releases");
  container.setAttribute("aria-busy", "true");
  try {
    const count = visibleCount + 10;
    // Keep one older release available as the comparison base for the last visible release.
    while (hasMore && releases.length <= count) {
      const result = await request(`/releases?per_page=20&page=${nextPage}`);
      releases.push(...result.data);
      hasMore = result.hasNext;
      nextPage++;
    }
    if (!initialLoad) await finishLoading();
    let firstRelease;
    for (let index = visibleCount; index < Math.min(count, releases.length); index++) {
      const release = createRelease(releases[index], releases[index + 1]);
      container.append(release.item);
      if (index === 0) firstRelease = release;
    }
    if (initialLoad) {
      if (firstRelease) await firstRelease.load(true);
      await finishLoading();
      container.hidden = false;
      if (firstRelease) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        firstRelease.item.setAttribute("open", "");
      }
    }
    visibleCount = Math.min(count, releases.length);
    status.textContent = visibleCount ? "" : "No releases have been published yet.";
    loadButton.textContent = "Load more releases";
    loadButton.hidden = !hasMore && visibleCount === releases.length;
  } catch (error) {
    console.error("Failed to load releases:", error);
    await finishLoading();
    status.textContent = errorMessage(error);
    loadButton.textContent = "Retry loading releases";
    loadButton.hidden = false;
  } finally {
    loadButton.disabled = false;
    container.removeAttribute("aria-busy");
  }
}

loadButton.addEventListener("click", loadReleases);
loadReleases();
