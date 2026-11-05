# meconsulting.com

The M&E Consulting, LLC website. Built with [Eleventy](https://www.11ty.dev/) and hosted on Netlify.

## Editing the site (no code needed)

Go to **https://www.meconsulting.com/admin/** and sign in with GitHub.

| To change… | Open… |
|---|---|
| Add, edit or remove a project, its photos or systems | **Projects** |
| Add or remove a team member, update a title or headshot | **Team** |
| Post or close a job opening | **Job Openings** (turn off *Show on website* when filled) |
| Homepage headline, hero slideshow, featured project, selected work | **Site Settings → Homepage** |
| Phone, offices, hours, certifications | **Site Settings → Company Details** |

Click **Save**. The live site updates on its own in about a minute.

## Where things live

- `src/projects/` – one file per project
- `src/team/` – one file per person
- `src/jobs/` – one file per job opening
- `src/_data/home.json` – homepage settings
- `src/_data/site.json` – company details
- `src/images/` – photos (projects, team, icons)
- `src/admin/` – the admin page (Sveltia CMS, hosted with the site)
- `src/css/site.css`, `src/js/site.js` – the design and interactions

## For developers

```bash
npm install
npm start        # local preview at http://localhost:8080
npm run build    # outputs to _site/
```

Contact-form submissions are collected by Netlify Forms (form name `project-inquiry`). Set the notification email in Netlify under **Forms → Notifications**.
