# Introduction
REKO is a Software as a Service (SaaS) platform that offers bespoke solutions to businesses looking to leverage customer and survey data for strategic decision-making. In today's data-saturated digital landscape, REKO aims to democratise data analytics by simplifying complex datasets into intuitive, visually engaging insights, making data analytics accessible to businesses of all sizes. To address the limitations of existing tools, REKO distinguishes itself by offering an intuitive user interface and visually captivating representations. It operates on a scalable and affordable freemium subscription model, which makes it accessible to businesses of all scales. The platform is hosted on AWS, utilising a robust suite of services to ensure scalability, reliability, and security. We are positioned to capture significant market share in an era that demands data-driven decision-making. The company plans future enhancements, including advanced analytics and a tiered subscription model, to solidify its leadership in data visualisation and analytics by providing unmatched value to users and stakeholders.

How to install
1. Setup an EC2 instance, S3 bucket and CloudFront on AWS
2. git clone codes onto EC2 instance
3. Create virtual environment
    ```bash
    python3 -m venv venv
4. Activate the virtual environment
    ```bash
    source venv/bin/activate
3. Install Dependencies: Use pip to install the required dependencies listed in `requirements.txt`.
   ```bash
   pip install -r requirements.txt
4. Run Gunicorn
    ```bash
    gunicorn -b 0.0.0.0:8000 app:app
5. sudo nano to /etc/systemd/system/reko.service and add the following into the file.
    ```bash
    [Unit]
    Description=Gunicorn instance for a simple hello world app
    After=network.target
    [Service]
    User=ubuntu
    Group=www-data
    WorkingDirectory=/home/ubuntu/helloworld
    ExecStart=/home/ubuntu/helloworld/venv/bin/gunicorn -b localhost:8000 app:app
    Restart=always
    [Install]
    WantedBy=multi-user.target
