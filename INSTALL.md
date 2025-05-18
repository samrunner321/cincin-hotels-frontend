# CinCin Hotels Directus CMS Installation Guide

This guide will walk you through setting up the Directus CMS for CinCin Hotels.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 16+ installed
- Git

## Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourorg/cincinhotels.git
   cd cincinhotels
   ```

2. **Prepare Environment Variables**

   ```bash
   cp example.env .env
   ```

   Edit the `.env` file with your specific configuration:
   - Change the `DB_PASSWORD` to a secure password
   - Update the `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the Directus admin account
   - Generate new `KEY` and `SECRET` values for production (use `openssl rand -hex 16` or another secure method)
   - Set `CORS_ORIGIN` to your frontend URL
   - Set `PUBLIC_URL` to your Directus instance URL

3. **Start Directus**

   ```bash
   docker-compose up -d
   ```

   This will start Directus, PostgreSQL database, and Redis cache.

4. **Access Directus Admin Interface**

   Once the containers are running, you can access the Directus admin interface at:
   
   ```
   http://localhost:8055/admin
   ```

   Use the admin email and password from your `.env` file to log in.

5. **Install Schema and Sample Data**

   ```bash
   npm run import-schema
   ```

## Setting Up for Production

For production deployment, follow these additional steps:

1. **Configure SSL**
   
   It's recommended to use a reverse proxy like Nginx for SSL termination.

2. **Update Environment Variables**

   ```
   PUBLIC_URL=https://cms.cincinhotels.com
   CORS_ORIGIN=https://cincinhotels.com
   ```

3. **Set Up Database Backups**

   Configure regular database backups using `pg_dump`:

   ```bash
   # Add to crontab
   0 1 * * * docker exec cincinhotels_db pg_dump -U directus -d cincinhotels > /path/to/backups/cincinhotels_$(date +\%Y\%m\%d).sql
   ```

4. **Configure Storage**

   For production, consider using S3, Azure, or other cloud storage for uploads:

   Add to `.env`:
   ```
   STORAGE_LOCATIONS=s3
   STORAGE_S3_DRIVER=s3
   STORAGE_S3_KEY=your_access_key
   STORAGE_S3_SECRET=your_secret_key
   STORAGE_S3_BUCKET=cincinhotels-media
   STORAGE_S3_REGION=eu-central-1
   ```

## User Roles and Permissions

After installation, configure the following roles:

1. **Editors** - Can edit content but not modify schema
2. **Translators** - Can edit translations only
3. **Managers** - Can manage content and users, but not system settings

Configure the roles through the Directus admin interface:
- Settings > Roles & Permissions

## Troubleshooting

- **Container Issues**: Check logs with `docker-compose logs directus`
- **Database Connection**: Ensure the database credentials are correct
- **Upload Problems**: Check folder permissions on the `uploads` directory