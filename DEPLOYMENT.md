# Deployment Guide

This document provides instructions for deploying the Splitter application to production environments.

## Deployment Options

### 1. Docker Deployment (Recommended)
The application includes Docker configuration for easy deployment.

#### Prerequisites
- Docker Engine 20.10+
- Docker Compose 1.29+

#### Deployment Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. Update environment variables in `docker-compose.yml`:
   ```yaml
   environment:
     - MONGODB_URI=your_production_mongodb_uri
     - JWT_SECRET=your_production_jwt_secret
   ```

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:19000
   - Backend API: http://localhost:3000

### 2. Manual Deployment

#### Backend Deployment
1. Navigate to the backend directory:
   ```bash
   cd splitter-backend
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Set environment variables:
   ```bash
   export NODE_ENV=production
   export PORT=3000
   export MONGODB_URI=your_production_mongodb_uri
   export JWT_SECRET=your_production_jwt_secret
   ```

5. Start the application:
   ```bash
   npm start
   ```

#### Frontend Deployment
1. Navigate to the frontend directory:
   ```bash
   cd splitter-app
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Deploy the build to your hosting provider (e.g., Vercel, Netlify, or static file server)

### 3. Cloud Deployment

#### Using Expo Application Services (EAS)
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure your project:
   ```bash
   eas build:configure
   ```

4. Build for production:
   ```bash
   eas build --profile production --platform all
   ```

5. Submit to app stores:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## Environment Variables

### Backend
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

### Frontend
```env
API_BASE_URL=https://your-production-api-url.com/api
```

## Database Setup

### MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure database access:
   - Add a database user
   - Add IP whitelist (0.0.0.0/0 for all IPs or specific IPs)
4. Get the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

### Self-hosted MongoDB
1. Install MongoDB on your server
2. Configure security settings
3. Create database and user
4. Set up backups and monitoring

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx
1. Install Certbot:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. Configure Nginx to proxy requests:
   ```nginx
   server {
     listen 443 ssl;
     server_name yourdomain.com;
     
     ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
     
     location /api/ {
       proxy_pass http://localhost:3000/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
     
     location / {
       proxy_pass http://localhost:19000/;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

## Monitoring and Logging

### Backend Monitoring
- Use PM2 for process management:
  ```bash
  npm install -g pm2
  pm2 start dist/server.js
  pm2 monit
  ```

- Set up logging:
  ```bash
  pm2 logs
  ```

### Frontend Monitoring
- Use error tracking services (e.g., Sentry):
  ```bash
  npm install @sentry/react-native
  ```

### Performance Monitoring
- Use Application Performance Monitoring (APM) tools
- Monitor API response times
- Track database query performance
- Monitor server resource usage

## Backup and Recovery

### Database Backups
1. Set up automated backups:
   ```bash
   mongodump --uri="mongodb://<username>:<password>@<host>:<port>/<database>" --out=/backups/
   ```

2. Schedule backups with cron:
   ```bash
   0 2 * * * mongodump --uri="mongodb://..." --out=/backups/
   ```

3. Test backup restoration regularly

### Application Backups
1. Backup application code and configuration
2. Backup environment variables (securely)
3. Backup SSL certificates
4. Document deployment procedures

## Scaling

### Horizontal Scaling
- Use load balancers for multiple backend instances
- Use CDN for static assets
- Implement database sharding for large datasets

### Vertical Scaling
- Upgrade server resources (CPU, RAM, storage)
- Optimize database indexes
- Implement caching strategies

## Security Considerations

### Backend Security
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Validate all API requests
- Use secure headers

### Frontend Security
- Implement Content Security Policy (CSP)
- Prevent XSS attacks
- Validate user inputs
- Use secure authentication

### Network Security
- Use firewalls to restrict access
- Implement network segmentation
- Use VPN for administrative access
- Monitor network traffic

## Troubleshooting

### Common Issues
1. **Database connection failures**:
   - Check connection string
   - Verify network connectivity
   - Check database credentials

2. **Application not starting**:
   - Check logs for error messages
   - Verify environment variables
   - Check port availability

3. **Performance issues**:
   - Monitor server resources
   - Check database query performance
   - Implement caching

### Rollback Procedures
1. Keep previous versions of the application
2. Document rollback steps
3. Test rollback procedures regularly
4. Have a disaster recovery plan

## Maintenance

### Regular Tasks
- Update dependencies regularly
- Monitor application logs
- Perform security audits
- Review and update documentation
- Test backup and recovery procedures

### Updates
1. Test updates in staging environment first
2. Create deployment checklists
3. Schedule maintenance windows
4. Communicate with users about downtime

## Support and Monitoring

### Alerting
- Set up alerts for:
  - Application downtime
  - High error rates
  - Performance degradation
  - Resource exhaustion

### Incident Response
1. Document incident response procedures
2. Define escalation paths
3. Maintain contact information for team members
4. Conduct post-incident reviews

## Conclusion

This deployment guide provides a comprehensive overview of deploying the Splitter application. Always test deployment procedures in a staging environment before deploying to production, and ensure you have proper monitoring and backup procedures in place.