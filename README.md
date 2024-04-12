# Introduction
REKO is a Software as a Service (SaaS) platform that offers bespoke solutions to businesses looking to leverage customer and survey data for strategic decision-making. In today's data-saturated digital landscape, REKO aims to democratise data analytics by simplifying complex datasets into intuitive, visually engaging insights, making data analytics accessible to businesses of all sizes. To address the limitations of existing tools, REKO distinguishes itself by offering an intuitive user interface and visually captivating representations. It operates on a scalable and affordable freemium subscription model, which makes it accessible to businesses of all scales. The platform is hosted on AWS, utilising a robust suite of services to ensure scalability, reliability, and security. We are positioned to capture significant market share in an era that demands data-driven decision-making. The company plans future enhancements, including advanced analytics and a tiered subscription model, to solidify its leadership in data visualisation and analytics by providing unmatched value to users and stakeholders.

## Implementation
The application will be hosted on an AWS EC2 instance, utilizing Gunicorn as the application server and sitting behind an Nginx proxy for enhanced performance and security. It will leverage connectivity to Amazon S3 for storage and CloudFront for content delivery. However, as there is no registered domain name, integration with Cognito for authentication and Route53 for DNS management will not be implemented.

## How to install
1. Setup an EC2 instance(enable IAM role), S3 bucket and CloudFront on AWS

2. git clone codes onto EC2 instance

3. Inside the reko repository, create virtual environment
    ```bash
    python3 -m venv venv

4. Activate the virtual environment
    ```bash
    source venv/bin/activate

3. Install Dependencies: Use pip to install the required dependencies listed in `requirements.txt`.
   ```bash
   pip install -r requirements.txt

4. Setup the SQLite database with the following interminal commands
    ```bash
    flask shell
    >>> db.create_all()
    >>> exit()

5. Run Gunicorn
    ```bash
    gunicorn -b 0.0.0.0:8000 app:app

6. sudo nano to /etc/systemd/system/reko.service and add the following into the file.
    ```bash
    [Unit]
    Description=Gunicorn instance for a flask app
    After=network.target
    [Service]
    User=ubuntu
    Group=www-data
    WorkingDirectory=/home/ubuntu/reko
    ExecStart=/home/ubuntu/reko/venv/bin/gunicorn -b localhost:8000 app:app
    Restart=always
    [Install]
    WantedBy=multi-user.target

7. Enable the service
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl start reko
    sudo systemctl enable reko

8. Start Nginx service
    ```bash
    sudo systemctl start nginx
    sudo systemctl enable nginx

9. Edit the default file in /etc/nginx/sites-available/default and add the following to the top of the file
    ```bash
    upstream reko {
        server 127.0.0.1:8000;
    }

10. Add proxy pass for the endpoints
    ```bash
    location / {
        proxy_pass http://localhost:8000;
        try_files $uri $uri/ =404;
    }
    location /static/ {
        alias /home/ubuntu/reko/reko_app/static/;
    }
    location /home {
        proxy_pass http://localhost:8000;
    }
    location /register {
        proxy_pass http://localhost:8000;
    }
    location /delete_file/ {
        proxy_pass http://localhost:8000;
    }
    location /logout {
        proxy_pass http://localhost:8000;
    }

11. Restart Nginx
    ```bash
    sudo systemctl restart nginx

## Author
Tey Ming Chuan