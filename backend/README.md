# IUI-Project

## Backend API

Home of the core build of the GGEZ API.

### Installation

* [**IMPORTANT**] Initialize a `virtualenv` and activate.  
As an additional check make sure that your console reads the `virtualenv` label as _backend_ after activating.

```bash
virtualenv -p python3 ./
source bin/activate
```  

* Install necessary packages for the flask API

```bash
pip install -r requirements.txt
```

* Test run the application!

```bash
python flaksServer.py
```  

Head over to [http://127.0.0.1:5000/](http://127.0.0.1:5000/) on your favourite browser.

### Jupyter Notebook

This directory contains multiple jupyter notebooks that were used during the making of the trained models. Most libraries have been mentioned in the `requirements.txt` file, however it might be so that you require additional dependencies to get everything running.

## Troubleshooting

In case you do not have `virtualenv` installed have a look down below.  

### Linux  
```bash
# Debian, Ubuntu
$ sudo apt-get install python-virtualenv

# CentOS, Fedora
$ sudo yum install python-virtualenv

# Arch
$ sudo pacman -S python-virtualenv
```

### Mac OS X or Windows  
```bash
$ sudo python2 Downloads/get-pip.py
$ sudo python2 -m pip install virtualenv
```

### On windows as administrator
```bash
> \Python27\python.exe Downloads\get-pip.py
> \Python27\python.exe -m pip install virtualenv
```

Now you can return to the Installation Notes to continue.