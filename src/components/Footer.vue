<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="footer-brand">
                    <img src="/logo.png" alt="VueMall Logo" class="footer-logo" />
                    <p class="slogan">轻松购物，品质生活</p>
                </div>

                <div class="footer-column">
                    <h4>用户支持</h4>
                    <ul>
                        <li><a href="#">帮助中心</a></li>
                        <li><a href="#">购物流程</a></li>
                        <li><a href="#">退换货政策</a></li>
                        <li><a href="#">联系客服</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4>关于我们</h4>
                    <ul>
                        <li><a href="#">公司介绍</a></li>
                        <li><a href="#">加入我们</a></li>
                        <li><a href="#">法律条款</a></li>
                        <li><a href="#">隐私政策</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4>更多服务</h4>
                    <ul>
                        <li><a href="#">商务合作</a></li>
                        <li><a href="#">APP 下载</a></li>
                        <li><a href="#">公众号 / 小程序</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="social-icons" role="list">
                    <a href="#" aria-label="微博" class="icon weibo" title="微博" target="_blank"
                        rel="noopener noreferrer"></a>
                    <a href="#" aria-label="微信" class="icon wechat" title="微信" target="_blank"
                        rel="noopener noreferrer"></a>
                    <a href="#" aria-label="QQ" class="icon qq" title="QQ" target="_blank"
                        rel="noopener noreferrer"></a>
                </div>

                <p>© 2025 VueMall 版权所有 · 京ICP备12345678号</p>
                <p>粤公网安备 44000000000000号</p>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background-color: #111;
    /* 深黑，现代且沉稳 */
    color: #ddd;
    font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    padding: 60px 40px 30px;
    user-select: none;
    line-height: 1.6;
    box-sizing: border-box;
    /* 大屏优化，宽度最大限制 */
    max-width: 1600px;
    margin: 0 auto;
}

.footer-container {
    display: flex;
    flex-direction: column;
}

.footer-top {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 50px;
    flex-wrap: nowrap;
}

.footer-brand {
    flex: 1 0 220px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: #eee;
}

.footer-logo {
    width: 140px;
    height: auto;
    filter: brightness(1.1);
    transition: filter 0.3s ease;
    cursor: default;
}

.footer-logo:hover {
    filter: brightness(1.3);
}

.slogan {
    font-weight: 400;
    font-size: 14px;
    color: #999;
}

.footer-column {
    flex: 1 1 150px;
}

.footer-column h4 {
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    margin-bottom: 18px;
    letter-spacing: 0.03em;
}

.footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-column ul li {
    margin-bottom: 14px;
}

.footer-column ul li a {
    color: #bbb;
    text-decoration: none;
    transition: color 0.25s ease;
    font-weight: 400;
    font-size: 14px;
    display: inline-block;
    position: relative;
    padding-left: 2px;
}

.footer-column ul li a::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: #1e90ff;
    transition: width 0.3s ease;
}

.footer-column ul li a:hover {
    color: #1e90ff;
}

.footer-column ul li a:hover::after {
    width: 100%;
}

.footer-bottom {
    border-top: 1px solid #222;
    padding-top: 24px;
    color: #ffffff;
    text-align: center;
    font-size: 13px;
    user-select: text;
    line-height: 1.5;
}

.footer-bottom p {
    margin: 4px 0;
}

/* 社交图标 */
.social-icons {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 24px;
}

.icon {
    width: 32px;
    height: 32px;
    filter: grayscale(100%) brightness(0.7);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 22px 22px;
    border-radius: 50%;
    cursor: pointer;
    transition: filter 0.3s ease, background-color 0.3s ease;
    display: inline-block;

    filter: invert(1) brightness(1.8);
}

.icon:hover {
    filter: none;
    background-color: #1e90ff;
    box-shadow: 0 0 8px rgba(30, 144, 255, 0.8);
}

.icon.weibo {
    background-image: url('https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/sinaweibo.svg');
}

.icon.wechat {
    background-image: url('https://api.iconify.design/simple-icons/wechat.svg');
}

.icon.qq {
    background-image: url('https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/qq.svg');
}

/* 响应式适配 */
@media (max-width: 1024px) {
    .footer-top {
        flex-wrap: wrap;
        justify-content: center;
        gap: 32px;
    }

    .footer-column {
        flex: 1 1 200px;
    }
}

@media (max-width: 600px) {
    .footer {
        padding: 40px 20px 20px;
    }

    .footer-top {
        flex-direction: column;
        gap: 36px;
    }

    .footer-brand {
        align-items: center;
        text-align: center;
    }

    .footer-column {
        text-align: center;
        flex: none;
    }

    .social-icons {
        gap: 32px;
    }
}
</style>