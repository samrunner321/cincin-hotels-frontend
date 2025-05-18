# Deployment Guide for CinCin Hotels on Hetzner

This guide provides step-by-step instructions for deploying the CinCin Hotels website on a Hetzner VPS (Virtual Private Server).

## Overview

The deployment consists of two main components:

1. **Directus CMS Backend**: Hosted in Docker containers on a Hetzner VPS
2. **Next.js Frontend**: Deployed on Vercel (or alternatively on the same Hetzner VPS)

## Prerequisites

- A Hetzner Cloud account
- A domain name with access to DNS settings
- SSH key pair for secure server access
- Basic knowledge of Linux command line

## Server Setup

### 1. Create a Hetzner Cloud Server

1. Log in to the [Hetzner Cloud Console](https://console.hetzner.cloud/)
2. Click "Add Server"
3. Choose the following specifications:
   - **Location**: Choose a location close to your target audience (e.g., Nuremberg or Helsinki for European users)
   - **Image**: Ubuntu 22.04
   - **Type**: Standard with at least 4 GB RAM (CPX21 or higher recommended)
   - **SSH Key**: Add your public SSH key
   - **Name**: `cincinhotels-production`
4. Click "Create & Buy Now"

### 2. Initial Server Configuration

Connect to your server via SSH:

```bash
ssh root@your_server_ip
```

Update the system and install essential packages:

```bash
apt update && apt upgrade -y
apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    fail2ban \
    ufw
```

### 3. Set Up a Non-Root User

Create a new user with sudo privileges:

```bash
adduser deploy
usermod -aG sudo deploy
```

Set up SSH keys for the new user:

```bash
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### 4. Configure Firewall

Set up basic firewall rules:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 5. Install Docker and Docker Compose

Install Docker:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Install Docker Compose:

```bash
curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

Add the deploy user to the docker group:

```bash
usermod -aG docker deploy
```

## Directus Deployment

### 1. Set Up Project Directory

Switch to the deploy user:

```bash
su - deploy
```

Create project directory:

```bash
mkdir -p ~/cincinhotels
cd ~/cincinhotels
```

### 2. Clone Repository (Optional)

If you have a Git repository with your project configuration:

```bash
git clone https://github.com/yourusername/cincinhotels.git .
```

Alternatively, create the necessary files manually.

### 3. Configure Environment Variables

Create a production .env file:

```bash
nano .env
```

Add the following environment variables (replace with your secure values):

```
# Database Configuration
DB_USER=directus_prod
DB_PASSWORD=your_secure_password
DB_DATABASE=cincinhotels_prod

# Directus Configuration
PORT=8055
KEY=generate_a_random_uuid_here
SECRET=generate_another_random_uuid_here
ADMIN_EMAIL=admin@cincinhotels.com
ADMIN_PASSWORD=your_secure_admin_password

# CORS & Public URL
CORS_ORIGIN=https://cincinhotels.com
PUBLIC_URL=https://cms.cincinhotels.com

# Email Configuration
EMAIL_FROM=noreply@cincinhotels.com
EMAIL_SMTP_HOST=smtp.your-email-provider.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your_smtp_username
EMAIL_SMTP_PASSWORD=your_smtp_password
EMAIL_SMTP_SECURE=false
```

To generate random UUIDs for KEY and SECRET:

```bash
uuidgen
```

### 4. Set Up Directory Structure

Create required directories:

```bash
mkdir -p data/database data/cache uploads extensions backups nginx/conf.d nginx/ssl nginx/logs
```

### 5. Configure NGINX

Create NGINX configuration:

```bash
nano nginx/conf.d/directus.conf
```

Use the configuration from your project's `nginx/conf.d/directus.conf` file.

### 6. Set Up SSL Certificates

#### Using Let's Encrypt and Certbot

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain SSL certificates:

```bash
sudo certbot --nginx -d cms.cincinhotels.com
```

Copy the certificates to your NGINX SSL directory:

```bash
sudo cp /etc/letsencrypt/live/cms.cincinhotels.com/fullchain.pem /home/deploy/cincinhotels/nginx/ssl/
sudo cp /etc/letsencrypt/live/cms.cincinhotels.com/privkey.pem /home/deploy/cincinhotels/nginx/ssl/
sudo chown deploy:deploy /home/deploy/cincinhotels/nginx/ssl/*.pem
```

Set up automatic renewal:

```bash
sudo crontab -e
```

Add the following line:

```
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/cms.cincinhotels.com/fullchain.pem /home/deploy/cincinhotels/nginx/ssl/ && cp /etc/letsencrypt/live/cms.cincinhotels.com/privkey.pem /home/deploy/cincinhotels/nginx/ssl/ && chown deploy:deploy /home/deploy/cincinhotels/nginx/ssl/*.pem && docker compose -f /home/deploy/cincinhotels/docker-compose.production.yml restart nginx
```

### 7. Deploy Directus

Start the Docker containers:

```bash
cd ~/cincinhotels
docker-compose -f docker-compose.production.yml up -d
```

Verify that the containers are running:

```bash
docker ps
```

### 8. Import Sample Data (Optional)

If you want to import sample data:

```bash
npm run import-sample-data
```

## Next.js Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Push your frontend code to a Git repository (GitHub, GitLab, or BitBucket)
2. Log in to [Vercel](https://vercel.com/)
3. Click "Import Project" and select your repository
4. Configure environment variables:
   - `NEXT_PUBLIC_DIRECTUS_URL=https://cms.cincinhotels.com`
   - `DIRECTUS_TOKEN=your_directus_api_token`
5. Click "Deploy"

### Option 2: Deploy on the Same Hetzner VPS

1. Install Node.js and npm:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

2. Clone your frontend repository:

```bash
cd ~/
git clone https://github.com/yourusername/cincinhotels-frontend.git
cd cincinhotels-frontend
```

3. Install dependencies and build:

```bash
npm install
npm run build
```

4. Install PM2 for process management:

```bash
sudo npm install -g pm2
```

5. Start the Next.js application:

```bash
pm2 start npm --name "cincinhotels" -- start
pm2 save
pm2 startup
```

6. Configure NGINX for the frontend:

```bash
sudo nano /etc/nginx/sites-available/cincinhotels
```

Add the following configuration:

```
server {
    listen 80;
    server_name cincinhotels.com www.cincinhotels.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name cincinhotels.com www.cincinhotels.com;
    
    ssl_certificate /etc/letsencrypt/live/cincinhotels.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cincinhotels.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/cincinhotels /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## DNS Configuration

Configure your domain's DNS settings:

1. Log in to your domain registrar's DNS management
2. Add the following A records:
   - `cincinhotels.com` → Your server IP
   - `www.cincinhotels.com` → Your server IP
   - `cms.cincinhotels.com` → Your server IP
3. Wait for DNS changes to propagate (may take up to 24-48 hours)

## Monitoring and Maintenance

### Set Up Regular Backups

The production Docker Compose configuration includes a backup service that performs daily backups. You can also manually trigger a backup:

```bash
cd ~/cincinhotels
npm run backup-db
```

For additional security, set up remote backups:

```bash
sudo apt install -y rclone
rclone config
```

Configure rclone to work with your preferred cloud storage provider (AWS S3, Google Drive, etc.).

Create a backup script:

```bash
nano ~/backup.sh
```

Add the following content:

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/cincinhotels/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M)
BACKUP_FILE="cincinhotels_${TIMESTAMP}.sql"

# Create backup
cd /home/deploy/cincinhotels
docker exec cincinhotels_db_prod pg_dump -U directus_prod -d cincinhotels_prod > "${BACKUP_DIR}/${BACKUP_FILE}"

# Upload to cloud storage
rclone copy "${BACKUP_DIR}/${BACKUP_FILE}" remote:cincinhotels-backups/

# Remove backups older than 7 days
find ${BACKUP_DIR} -name "cincinhotels_*.sql" -type f -mtime +7 -delete
```

Make the script executable:

```bash
chmod +x ~/backup.sh
```

Add to crontab:

```bash
crontab -e
```

Add the following line:

```
0 1 * * * /home/deploy/backup.sh
```

### Monitoring with Netdata

Install Netdata for server monitoring:

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Configure NGINX to proxy Netdata:

```bash
sudo nano /etc/nginx/sites-available/netdata
```

Add the following configuration:

```
server {
    listen 80;
    server_name monitor.cincinhotels.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name monitor.cincinhotels.com;
    
    ssl_certificate /etc/letsencrypt/live/monitor.cincinhotels.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monitor.cincinhotels.com/privkey.pem;
    
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {
        proxy_pass http://localhost:19999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Create a password file:

```bash
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/netdata /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Regular Maintenance

Set up a regular maintenance schedule:

1. System updates:

```bash
sudo apt update && sudo apt upgrade -y
```

2. Docker updates:

```bash
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

3. Clean up unused Docker resources:

```bash
docker system prune -a --volumes
```

## Continuous Integration/Deployment (CI/CD)

For automated deployments, you can use GitHub Actions:

1. Create a deploy key:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
```

2. Add the private key to GitHub repository secrets as `SSH_PRIVATE_KEY`

3. Create a GitHub workflow file:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install SSH key
        uses: shimataro/ssh-key-action@v2
        with:
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          known_hosts: ${{ secrets.KNOWN_HOSTS }}
          
      - name: Deploy to server
        run: |
          ssh deploy@your_server_ip "cd ~/cincinhotels && \
          git pull && \
          docker-compose -f docker-compose.production.yml up -d"
```

## Troubleshooting

### Directus Issues

1. **Database Connection Problems**:
   Check database credentials in `.env` and verify PostgreSQL container is running.

2. **API Errors**:
   Check CORS configuration and ensure the API token is valid.

3. **File Upload Issues**:
   Check file permissions on the `uploads` directory.

### NGINX Issues

1. **SSL Certificate Problems**:
   Verify certificate paths and permissions.

2. **Connection Refused**:
   Check if Directus is running (`docker ps`) and NGINX configuration.

### Server Performance

1. **High CPU/Memory Usage**:
   Check Netdata for resource-intensive processes and consider upgrading server if needed.

2. **Slow Response Times**:
   Enable NGINX caching and optimize database queries.

## Scaling Considerations

As your traffic grows, consider the following scaling strategies:

1. **Horizontal Scaling**:
   - Set up a load balancer
   - Deploy multiple Next.js instances
   - Use Redis for session storage

2. **Vertical Scaling**:
   - Upgrade to a more powerful Hetzner server
   - Increase PostgreSQL resources

3. **CDN Integration**:
   - Configure a CDN (e.g., Cloudflare) for static assets
   - Enable asset caching in Directus

## Disaster Recovery

Prepare a disaster recovery plan:

1. **Regular Backups**:
   - Database backups
   - File system backups
   - Configuration backups

2. **Backup Testing**:
   - Regularly test restoring from backups
   - Document restoration procedures

3. **Failover Strategy**:
   - Set up a standby server
   - Automate failover process