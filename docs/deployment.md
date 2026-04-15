# Yugo Deployment Runbook

This document covers the end-to-end process of setting up DigitalOcean infrastructure and deploying the Yugo API, Henchmen, and Backoffice services.

## Prerequisites
- A DigitalOcean account
- A Namecheap/GoDaddy account handling DNS for `yugoev.com`
- A 1Password/Bitwarden team vault for storing credentials

---

## 1. DigitalOcean Managed MySQL Setup
1. Go to DigitalOcean Databases -> Create Database Cluster.
2. Select **MySQL 8**. 
3. Choose the **blr1 (Bangalore)** region.
4. Scale: 1 Node (Basic).
5. Add a database specifically named `yugo`.
6. Add a new user named `yugo_prod`. 
7. Save the raw password to your team vault.
8. Under **Trusted Sources**, restrict access to only allow connections from your Droplet (after it is created).

## 2. DigitalOcean Container Registry (DOCR)
1. Go to DigitalOcean Container Registry -> Create.
2. Name it `yugo`. 
3. Go to API -> Generate a new Personal Access Token with **Read + Write** scopes.
   - Name it: `drone-deploy-token`
   - Save this to 1Password.

## 3. Provisioning the Droplet
1. Create a Droplet.
2. Region: **blr1 (Bangalore)**.
3. Image: **Ubuntu 24.04 LTS**.
4. Size: Basic **s-2vcpu-4gb**.
5. Authentication: SSH Keys (add your personal key).
6. Enable Private Networking.
7. Once booted, SSH into it as `root`:
   ```bash
   ssh root@<droplet_ip>
   ```
8. Upload the script `infra/bootstrap.sh` and run it:
   ```bash
   chmod +x bootstrap.sh
   ./bootstrap.sh
   ```
9. Finally, add your public key to the `/home/officebot/.ssh/authorized_keys` file so Drone can SSH via the `officebot` user.

## 4. Environment and Project Initialization
Switch to the built `officebot` user on the Droplet:
```bash
su - officebot
```

Set up the project folder:
```bash
cd ~/yugo
# Upload your docker-compose.yml here
# Upload the 4 env files templates and rename them:
# .env, .env.api, .env.henchmen, .env.backoffice
```
Fill in the credentials in the `.env` files matching your MySQL string and generated Traefik password.

## 5. DNS Setup
Go to your DNS provider for `yugoev.com` and add `A` records pointing to your Droplet's public IP address:

| Type | Hostname / Subdomain | Value (IP) |
|---|---|---|
| A | `api` | Your Droplet IP |
| A | `admin` | Your Droplet IP |
| A | `henchmen` | Your Droplet IP |
| A | `traefik` | Your Droplet IP |

## 6. Drone CI Workflow
1. Go to your Drone CI dashboard.
2. Ensure you have synced the `yugo-app` repository.
3. Under Repository Settings -> Secrets, add the following three secrets:
   - `DOCR_TOKEN` = The DO Token you saved in step 2.
   - `DROPLET_HOST` = The droplet's public IP.
   - `SSH_PRIVATE_KEY` = The private SSH key for `officebot`.
4. Trigger a push to the `dev` branch.

## 7. CLI DB Migrations
To run an initial or future database migration in production, use the `cli` tool through a one-off docker command:
```bash
docker run --rm --env-file .env.api \
  registry.digitalocean.com/yugo/api:latest \
  ls -la # Wait, the CLI needs its own container if used strictly. 
  # Actually, the nestjs typeorm migration command can be triggered here. 
```

*(Note for dev: Review how `cli` runs the specific db:seed/migrate commands globally or wrap it into a separate minimal image if needed).*
