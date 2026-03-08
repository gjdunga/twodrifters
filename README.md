# Two Drifters: A Virtual Museum

A serene, Japanese Shinto temple-inspired virtual museum celebrating the adventures of Pat and Jack.

## Architecture

**Frontend**: React 19 + Vite, built to static files
**Backend**: PHP 8.1 for contact form and SPA routing
**Server**: Apache on Virtualmin 8.0.1 (Ubuntu 24.04.4)

## Directory Structure

```
twodrifters/
  frontend/           # React source (development)
    src/
      components/     # Reusable UI components
      pages/          # Route pages
      hooks/          # Audio context and custom hooks
      data/           # Site content data
  public_html/        # Production build output (deploy this)
    index.html        # Built React SPA
    index.php         # PHP fallback and SPA router
    .htaccess         # Apache rewrite rules
    api/
      contact.php     # Contact form endpoint
    assets/           # Built JS, CSS
```

## Development

```bash
cd frontend
npm install
npm run dev          # Start dev server on localhost:5173
npm run build        # Build to ../public_html/
```

## Deployment to Virtualmin

1. Point the virtual server's document root to the `public_html/` directory
   (or copy its contents to the existing document root)

2. Ensure Apache modules are enabled:
   ```bash
   sudo a2enmod rewrite headers deflate expires
   sudo systemctl reload apache2
   ```

3. Verify `.htaccess` is respected (AllowOverride All in the virtual host config)

4. For the contact form, edit `public_html/api/contact.php` and set the
   recipient email address in the `$to` variable

5. Create the data directory with proper permissions:
   ```bash
   mkdir -p public_html/data/contact
   chown www-data:www-data public_html/data/contact
   chmod 750 public_html/data/contact
   ```

## Audio

The site plays background music on each page. The home page attempts to load
a symphonic Moon River arrangement. Because this composition is under copyright,
you will need to either:

1. License a symphonic arrangement and place it at `public_html/audio/moonriver-symphonic.mp3`
2. Use the built-in royalty-free ambient fallback (already configured)
3. Replace with any CC0/royalty-free alternative

Other pages randomly select from ambient tracks served via Pixabay's free audio CDN.

## Customization

All site content (journey entries, couple bios, audio tracks) is defined in
`frontend/src/data/siteData.js`. Edit this file and rebuild to update content.

To add photos to the Temple of Children or Temple of Ancestors, replace the
placeholder cards in the respective page components.

## License

Private site for Pat and Jack. All rights reserved.
