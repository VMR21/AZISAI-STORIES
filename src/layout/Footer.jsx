export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/30 to-black pointer-events-none"></div>

      <div className="relative bg-gradient-to-b from-purple-950/60 to-black/90 backdrop-blur-xl border-t border-purple-500/10">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-6 shadow-lg shadow-purple-500/20">
              <img
                src="https://files.kick.com/images/user/3299289/profile_image/conversion/0ad1c855-b1e8-4a44-b081-d2697dd34364-fullsize.webp"
                alt="AZISAI Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-purple-100 mb-4">AZISAI0721</h2>

            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <a href="https://x.com/RATOR205" target="_blank" rel="noreferrer">
                <img
                  src="https://i.ibb.co/dJjtLCgh/Screenshot-2025-02-13-153630-removebg-preview.png"
                  alt="X"
                  className="h-12 w-12"
                />
              </a>
              <a href="https://youtube.com/@azisai-onkazi-kirinuki" target="_blank" rel="noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                  alt="YouTube"
                  className="h-12 w-12"
                />
              </a>
              <a href="https://kick.com/azisai0721" target="_blank" rel="noreferrer">
                <img
                  src="https://i.ibb.co/Zsw9SH9/images-removebg-preview.png"
                  alt="Kick"
                  className="h-12 w-16"
                />
              </a>
              <a href="https://roobet.com/?ref=azisai07219" target="_blank" rel="noreferrer">
                <img
                  src="https://i.ibb.co/8gKXJsDz/Screenshot-1-150x150-removebg-preview.png"
                  alt="Roobet"
                  className="h-12 w-12"
                />
              </a>
              <a href="https://play1w.com/jpn?sub3=AZISAI07219" target="_blank" rel="noreferrer">
                <img
                  src="https://cdn6.aptoide.com/imgs/4/9/f/49fd00da6f40e313a1164a5dce21aff8_icon.jpg?w=128"
                  alt="1Win"
                  className="h-12 w-12"
                />
              </a>
              <a href="https://discord.gg/azisai" target="_blank" rel="noreferrer">
                <img
                  src="https://i.ibb.co/81pqFsY/Screenshot-2025-02-13-153913-removebg-preview.png"
                  alt="Discord"
                  className="h-12 w-12"
                />
              </a>
            </div>

            <p className="text-purple-300 text-sm text-center mt-6">
              &copy; 2025 AZISAI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
