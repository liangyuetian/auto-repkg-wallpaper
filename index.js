const fs = require('fs')
const path = require('path')
const child_proces = require('child_process')

const startTime = '2021-07-15'
const startTimeStamp = new Date(startTime).getTime()
const wallpapperDir = 'E:/SteamLibrary/steamapps/workshop/content/431960'
// const RePKG = path.resolve(process.cwd(), 'RePKG.exe')
const RePKG = 'RePKG.exe'
let uid = 0

const wallpapperDirList = fs.readdirSync(wallpapperDir).filter(dir => {
    const statInfo = fs.statSync(path.resolve(wallpapperDir, dir))
    return new Date(statInfo.ctime).getTime() >= startTimeStamp
}).filter(dir => {
    let statInfo
    try {
        statInfo = fs.statSync(path.resolve(wallpapperDir, dir, 'scene.pkg'))
        return statInfo.isFile()
    } catch(e) {
        return false
    }
}).filter(dir => dir==='2535678031').map(dir => {
    return path.resolve(wallpapperDir, dir)
})

outputFile(wallpapperDirList)

async function outputFile(dirList) {
    if (!fs.opendirSync('imgs')) {
        fs.mkdirSync('imgs')
    }
    for (const dir of dirList) {
        child_proces.execSync(`${RePKG} extract ${path.resolve(dir, 'scene.pkg')}`)
        const materials = path.resolve('.', 'output', 'materials')
        try {
            const files = fs.readdirSync(materials).filter(file => file.includes('png') || file.includes('jpg'))
            
            for (file of files) {
                fs.renameSync(path.resolve(materials, file), path.resolve('.', 'imgs', uid++ + file))
                fs.rmSync(path.resolve(',', 'output'), {force: true, recursive: true})
            }

        } catch(e) {
            console.log(e);
        }
    }
}

