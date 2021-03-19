console.log("Hello RTM!")

const bip39 = require("bip39")
const QRCode = require('easyqrcodejs')
var hdkey = require('hdkey');
var createHash = require('create-hash');
var bs58check = require('bs58check');

import logo from './img/RTM_70b.png'
import i512 from './img/RTM_360.png'

const verbose = true

function generate_mnemonic(bits=128) {
  const mnemonic = bip39.generateMnemonic(bits)
  const element = document.querySelector("#BIP39-input")
  element.value = mnemonic
}


function generate_mnemonic12() {
    generate_mnemonic(128)
}


function generate_mnemonic24() {
    generate_mnemonic(256)
}

function generate_options() {
    const x = document.querySelector("#options")
    if (x.style.display === "none") {
        x.style.display = "block"
    } else {
        x.style.display = "none"
    }
}


function getKeyRowWithQR(index, path, privateKey, publicKey, address, paperCode, tHeadClass='') {
    return  `
        <div class="col-12">
          <table class="table" style="border: 1px solid #aaa;">
          <thead class="${tHeadClass}">
            <tr>
              <th>Keys</th><th>Values (Address ${index} - derive path ${path})</th><th>Address QR Code</th>
            </tr>
          </thead>
            <tr>
              <td>Address</td><td>${address}</td><td rowspan="3"  style="text-align:center; vertical-align:center"><div class="qr" id="qrcode_${index+1}"></div></td>
            </tr>
            <tr>
              <td>Private key</td><td>${privateKey}</td>
            </tr>
            <tr>
              <td>Public key</td><td><textarea class="form-control" >${publicKey}</textarea></td>
            </tr>
            <tr>
               <td colspan="3">paperCode ${index}: <textarea class="form-control" >${paperCode}</textarea>
               </td>
            </tr>
          </table>
        </div>
    `
}


function pubkey_to_address(publicKey) {
    const step1 = publicKey;
    const step2 = createHash('sha256').update(step1).digest();
    const step3 = createHash('rmd160').update(step2).digest();
    var step4 = Buffer.allocUnsafe(21);
    step4.writeUInt8(60, 0);
    step3.copy(step4, 1);
    const step9 = bs58check.encode(step4);
    return step9;
}


function generate_addresses() {
    const mnemonic = document.querySelector("#BIP39-input").value.trim()
    const password = document.querySelector("#BIP39-pass").value.trim()
    var seed;
    if (password == '') {
        seed = bip39.mnemonicToSeedSync(mnemonic); //.slice(0,32); //creates seed buffer
    } else {
        seed = bip39.mnemonicToSeedSync(mnemonic, password); //.slice(0,32); //creates seed buffer
    }
    if (verbose) {
        //console.log('Seed: ' + seed);
        console.log('Seed hex: ' + seed.toString('hex'));
        console.log('mnemonic: ' + mnemonic);
    }

    const root = hdkey.fromMasterSeed(seed);
    var address =  pubkey_to_address(root.publicKey);
    //if (verbose) console.log('root addr: ' + address);

    const masterPrivateKey = root.privateKey.toString('hex');
    if (verbose) console.log('masterPrivateKey: ' + masterPrivateKey);

    const count = parseInt(document.querySelector("#BIP39-count").value, 10)
    const wrapper = document.querySelector("#addresses")
    let content = ''
    let extraClass=''
    let ids = []
    let i = 0
    let path = ''

    const code200 = document.querySelector("#type200").checked
    const codexxx = document.querySelector("#typeXXX").checked
    const codestacy = document.querySelector("#typeStacy").checked

    let chaincode = '200'
    if (document.querySelector("#typeXXX").checked) {
        chaincode = '222'
    }
    for (i=0; i<count; i++) {
        path = `m/44'/` + chaincode + `'/0'/0/` + i.toString()
        if (document.querySelector("#typeStacy").checked) {
            // Stacy custom derive path
            path = `m/0'/2'/` + i.toString()
        }
        if (verbose) console.log("path "+path)
        const derived = root.derive(path)
        const papercode = bip39.entropyToMnemonic(derived.privateKey.toString('hex'))
        const bis_address =  pubkey_to_address(derived.publicKey);
        content += getKeyRowWithQR(i, path, derived.privateKey.toString('hex'),
                             derived.publicKey.toString('hex'), bis_address,
                             papercode, extraClass);

        ids.push(bis_address)
        if (extraClass =='') {extraClass = 'thead-light'} else {extraClass = ''}

        wrapper.innerHTML = content
    }
        // https://www.color-hex.com/color-palette/9753
        let config = { text: "", // Content
                            width: 240, // Width
                            height: 240, // Height
                            //colorDark: "#630900", // Dark color
                            //colorDark: "#000000", // Dark color
                            colorDark: "#444444",
                            colorLight: "#ffffff", // Light color
                            //PO: '#630900', // Global Position Outer color. if not set, the defaut is `colorDark`
                            //PI: '#630900',
                            PO: '#b64426', // Global Position Outer color. if not set, the defaut is `colorDark`
                            PI: '#444444',
                            quietZone: 0,
                            // === Logo
                            logo: logo, // LOGO
                            //					logo:"http://127.0.0.1:8020/easy-qrcodejs/demo/logo.png",
                            logoWidth:64,
                            logoHeight:64,
                            //logoBackgroundColor: '#ffffff', // Logo background color, Invalid when `logBgTransparent` is true; default is '#ffffff'
                            logoBackgroundTransparent: true, // Whether use transparent image, default is false
                            //backgroundImage: i512,
                            //backgroundImageAlpha: 0.4,
                            autoColor: false,
                            correctLevel: QRCode.CorrectLevel.M // L, M, Q, H - don't use L, not enough dup info to allow for the logo
                            }
    for (i=1; i<=count; i++) {
        config.text = ids[i-1]
        let t = new QRCode(document.getElementById("qrcode_" + i), config)
    }

}

document.querySelector("#generate_mnemonic12").addEventListener("click", generate_mnemonic12)
document.querySelector("#generate_mnemonic24").addEventListener("click", generate_mnemonic24)
document.querySelector("#generate_addresses").addEventListener("click", generate_addresses)
document.querySelector("#generate_options").addEventListener("click", generate_options)

