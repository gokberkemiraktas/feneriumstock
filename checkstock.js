const https = require('https');
const cheerio = require('cheerio');
const nodemailer = require("nodemailer");

// E-posta taşıyıcısını oluşturun
const transporter = nodemailer.createTransport({
  host: "todo",
  port: 465,
  secure: true, // Port 465 için `true`, diğer tüm portlar için `false` kullanın
  auth: {
    user: "todo",
    pass: "todo",
  },
});

function checkStock() {
    const url = 'https://fenerium.com/unisex-retro-sari-lacivert-efsane-mont-p-tk115ecs015lc';

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {sdfsdf
            data += chunk;
        });

        response.on('end', () => {
            const $ = cheerio.load(data);
            const bodyItems = $('.label-item.body-item');

            let isMInStock = false;

            bodyItems.each(function() {
                const size = $(this).find('span.text').text().trim();
                const hasValue = $(this).find('input').attr('value');
                console.log("size:"+size+" value:"+hasValue);
                if (size == "M" && hasValue == "M") {
                    isMInStock = true;
                    return false;
                }
            });

            if (isMInStock) {
                console.log("M bedeni stokta.");
                // Eğer M bedeni stokta ise e-posta gönder
                sendMail();
            } else {
                console.log("M bedeni stokta değil.");
            }
        });

    }).on('error', (error) => {
        console.log('Hata:', error);
    });
}

// E-posta gönderme fonksiyonu
async function sendMail() {
    try {
        await transporter.sendMail({
            from: '"Fenerium Stock Checker" <todo>',
            to: "todo",
            subject: "Ürün Stokta",
            text: "M bedeni stokta. Ürün linki: https://fenerium.com/unisex-retro-sari-lacivert-efsane-mont-p-tk115ecs015lc",
            html: "<b>M bedeni stokta. Ürün linki: <a href='https://fenerium.com/unisex-retro-sari-lacivert-efsane-mont-p-tk115ecs015lc'>Fenerium Ürün Sayfası</a></b>"
        });
        console.log("E-posta gönderildi.");
    } catch (error) {
        console.error("E-posta gönderilirken hata oluştu:", error);
    }
}

// Stok kontrolünü başlat ve 10 dakikada bir tekrar et
checkStock();
setInterval(checkStock, 10 * 60 * 1000); // 10 dakika (10 * 60 * 1000 milisaniye)
