# Stromtod

## Project setup

```shell
yarn
```

## Compiles and hot-reloads for development

```shell
yarn dev
```

Project is running at <http://0.0.0.0:9000/>.

## Compiles and minifies for production

```shell
yarn build
```

Deploy updated content (at least `dist/` `index.html`) to
`ftp://$FTP_SERVER/stromtod`.

### Strategie for cache busting css and javascript files.

Update query strings for css and javascript file in `index.html` on
`$FTP_SERVER/stromtod`.

Because most browsers these days will see a URL with a different query string
as a different file and download a fresh copy. For example:

```html
<link rel="stylesheet" type="text/css" href="dist/main.css?v57673e93" />
```

Make small change? Change it to:

```html
<link rel="stylesheet" type="text/css" href="dist/main.css?va9e2aa6b" />
```

<link rel="stylesheet" href="style.css?v=3.4.2">



## FTP connection

```shell
ncftp -u $FTP_USER -p $FTP_PASSWORD $FTP_SERVER
```

```shell
ncftp -u $FTP_USER -p $FTP_PASSWORD ftp://$FTP_SERVER/stromtod
```

## Data

Sample [data/Stromtod.csv](data/Stromtod.csv) is here only for local testing and development.

Production data (`Stromtod.csv`) is served from `https://dl.dropboxusercontent.com`.

Have fun.
