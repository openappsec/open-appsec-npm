# About 
Nginx Proxy Manager is a popular open-source project that simplifies the management of NGINX reverse proxy configurations, offering a user-friendly web-based interface for easy setup and maintenance. It was created by “jc21”.
This project is particularly useful for individuals and organizations looking to streamline the deployment of web applications and services by efficiently managing multiple domains and subdomains through a centralized interface.
With NGINX Proxy Manager, users can effortlessly create and manage SSL certificates, enabling secure HTTPS connections for their applications, while also providing advanced features such as Let's Encrypt integration for automated certificate renewal.
NGINX Proxy Manager (NPM) is based on NGINX and provided as a container image that can be easily deployed in containerized environments like Docker (typically using Docker Compose) or others.
NPM itself does not include any WAF solution for effective Threat Prevention against modern attacks or Zero-day attacks.

Website and Docs: nginxproxymanager.com      Github: www.github.com/NginxProxyManager

### Integration of open-appsec WAF with NGINX Proxy Manager:
This new integration not only closes the security gap caused by the soon-end-of-life ModSecurity but provides a modern, strong protection alternative in the form of open-appsec, a preemptive, machine-learning-based, fully automatic WAF that does not rely on signatures at all.
While developing this integration we focused on maximum simplicity to maintain the low entry barrier of the NGINX proxy manager (NPM) project.
The actual deployment of NPM with open-appsec is performed using a slightly enhanced docker-compose file (see below) and configuring open-appsec can be done from an enhanced NPM Web UI interface to which the relevant configuration options for the open-appsec WAF, as well as an option to view the open-appsec logs, were added.

# Contributing
We welcome everyone that wishes to share their knowledge and expertise to enhance and expand the project.

Please see the [Contributing Guidelines](https://github.com/openappsec/openappsec/blob/main/CONTRIBUTING.md).

# License
open-appsec is open source and available under Apache 2.0 license.

The basic ML model is open source and available under Apache 2.0 license.

The advanced ML model is open source and available under Machine Learning Model license, available upon download in the tar file.
