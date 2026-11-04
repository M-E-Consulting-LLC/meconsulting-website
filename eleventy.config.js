// Eleventy configuration for meconsulting.com
// Content lives in src/projects, src/team and src/jobs (one Markdown file each),
// edited by staff through the admin page at /admin.

export default function (eleventyConfig) {
  // Copy static files straight through to the built site
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'src/admin': 'admin' });
  eleventyConfig.addPassthroughCopy({ 'src/downloads': 'downloads' });
  eleventyConfig.addPassthroughCopy({ 'src/fonts': 'fonts' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon.png': 'favicon.png' });

  const byOrder = (a, b) => (a.data.order ?? 999) - (b.data.order ?? 999) || String(a.data.title || a.data.name).localeCompare(String(b.data.title || b.data.name));

  eleventyConfig.addCollection('projects', api => api.getFilteredByGlob('src/projects/*.md').sort(byOrder));
  eleventyConfig.addCollection('team', api => api.getFilteredByGlob('src/team/*.md').sort(byOrder));
  eleventyConfig.addCollection('jobs', api => api.getFilteredByGlob('src/jobs/*.md').filter(j => j.data.open !== false).sort(byOrder));

  // Look up a project by its file slug (used by homepage settings)
  eleventyConfig.addFilter('projectBySlug', (projects, slug) => projects.find(p => p.fileSlug === slug));
  eleventyConfig.addFilter('inMarket', (projects, market) => projects.filter(p => p.data.market === market));
  eleventyConfig.addFilter('byDept', (people, dept) => people.filter(p => p.data.department === dept));
  eleventyConfig.addFilter('initials', name => String(name).split(/\s+/).filter(Boolean).map(w => w[0]).filter((c, i, a) => i === 0 || i === a.length - 1).join('').toUpperCase());
  eleventyConfig.addFilter('firstName', name => String(name).split(/\s+/)[0]);
  eleventyConfig.addFilter('json', v => JSON.stringify(v));
  eleventyConfig.addFilter('mailtoSubject', (to, subject) => 'mailto:' + String(to).replace(/\s+/g, '') + '?subject=' + encodeURIComponent(subject || ''));
  eleventyConfig.addFilter('year', () => new Date().getFullYear());

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
}
