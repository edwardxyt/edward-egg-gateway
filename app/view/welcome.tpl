<!-- app/view/news/list.tpl -->
<!DOCTYPE html>
<html lang="zh">

<head>
  <title>Hacker News</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="x5-orientation" content="portrait" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="format-detection" content="telephone=no">
  <!-- <link rel="stylesheet" href="/public/css/news.css" /> -->
</head>

<body>
  <ul class="news-view view">
    {% for item in list %}
    <li class="item">
      <a href="{{ item.url }}">{{ item.title }}-{{ helper.formatTime(item.create_at) }}</a>
    </li>
    {% endfor %}
  </ul>
</body>

</html>