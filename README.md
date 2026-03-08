# Two Drifters: A Virtual Museum

Japanese Shinto temple-inspired virtual museum for the adventures of Pat and Jack.

## Repo Structure

The **repo root IS the document root**. Clone or pull directly into
`/home/twodrifters/public_html/`.

```
. (repo root = document root = /home/twodrifters/public_html/)
  .htaccess        # Apache rewrite rules, security headers, compression
  index.html       # React SPA entry (built output)
  index.php        # PHP fallback router
  assets/          # Built JS and CSS (hashed filenames)
  api/
    contact.php    # Contact form endpoint
    diag.php       # Deployment diagnostic (DELETE after site works)
  audio/           # (your audio files, not in repo)
  _build/          # React source code (blocked from web access by .htaccess)
    src/
    vite.config.js
    package.json
```

## Deployment (Virtualmin 8.0.1, Ubuntu 24.04)

**First time:**
```bash
cd /home/twodrifters/public_html
git init
git remote add origin https://github.com/gjdunga/twodrifters.git
git fetch origin main
git checkout main
```

This preserves any existing files (like your audio/ directory) that are
not tracked by git.

**Subsequent updates:**
```bash
cd /home/twodrifters/public_html
git pull origin main
```

**Verify Apache modules:**
```bash
sudo a2enmod rewrite headers deflate expires
sudo systemctl reload apache2
```

**Verify AllowOverride** in the virtual host config
(`/etc/apache2/sites-available/twodrifters.org.conf` or similar):
```apache
<Directory /home/twodrifters/public_html>
    AllowOverride All
</Directory>
```

**Run the diagnostic:**
Visit `https://twodrifters.org/api/diag.php` to check that all files
are in place, modules are loaded, and .htaccess is being read.
Delete `api/diag.php` after the site is working.

**Contact form setup:**
```bash
mkdir -p /home/twodrifters/public_html/data/contact
chown www-data:www-data /home/twodrifters/public_html/data/contact
# Edit api/contact.php and set the $to email address
```

## Development

```bash
cd _build
npm install
npm run dev        # Dev server on localhost:5173
npm run build      # Outputs to repo root (../)
```

After building, commit and push the updated `index.html` and `assets/`.

## Audio

The home page tries `/audio/moonriver-syphonic.mp3` first, then falls
back to a royalty-free ambient track. Other pages pick randomly from
ambient CDN tracks.

Place audio files in the `audio/` directory at the document root.
This directory is not tracked by git.
