const https = require('https');
const cheerio = require('cheerio');
const nodemailer = require("nodemailer");

// E-posta taşıyıcısını oluşturun
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Port 465 için `true`, diğer tüm portlar için `false` kullanın
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

function checkStock() {
    const url = 'https://fenerium.com/unisex-retro-sari-lacivert-efsane-mont-p-tk115ecs015lc';

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
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
            from: '"Fenerium Stock Checker" <maddison53@ethereal.email>',
            to: "receiver@example.com",
            subject: "Ürün Stokta",
            text: "M bedeni stokta.",
            html: "<b>M bedeni stokta.</b>"
        });
        console.log("E-posta gönderildi.");
    } catch (error) {
        console.error("E-posta gönderilirken hata oluştu:", error);
    }
}

// Stok kontrolünü başlat ve 10 dakikada bir tekrar et
checkStock();
setInterval(checkStock, 10 * 60 * 1000); // 10 dakika (10 * 60 * 1000 milisaniye)
