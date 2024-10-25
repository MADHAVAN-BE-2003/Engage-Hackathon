const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'build', 'contracts', 'ProofOfSkill.json');
const destPath = path.join(__dirname, 'client-side', 'src', 'contract', 'ProofOfSkill.json');

try {
    if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
        console.log('Old ProofOfSkill.json deleted.');
    }

    fs.copyFileSync(sourcePath, destPath);
    console.log('New ProofOfSkill.json copied to client-side/src/contract/');
} catch (error) {
    console.error('Error during file operation:', error);
}
