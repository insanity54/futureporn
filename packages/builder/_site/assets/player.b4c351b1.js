const player = "";
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
function load() {
  return new Promise((resolve) => resolve());
}
const propsById = {
  "unHGl1": { name: "cid", value: "bafybeid3mg5lzrvnmpfi5ftwhiupp7i5bgkmdo7dnlwrvklbv33telrrry?filename=projektmelody-2020-02-07T00%3a00%3a00.000Z.mp4" },
  "p46c4U": { name: "cid", value: "bafybeiadehyo7tyk527lda5imkkh5lffw7q7t27dqbggpnqca7ltklhccm?filename=projektmelody-chaturbate-20200207T232100Z-240p.mp4" },
  "Y3d_zb": { name: "cid", value: "bafybeibueoqojhltiyry4bzbmhhiobgwcisvy6467aay6e3ew2liavhwpi?filename=projektmelody-chaturbate-20200208T161200Z-source.mp4" },
  "eT2_6L": { name: "cid", value: "bafybeifzg4f5g55uz263x4gbafgmjz4gkzfunrjyj5dxxgoffa5qbvnmde?filename=projektmelody-chaturbate-20200208T161200Z-240p.mp4" },
  "mK-aUT": { name: "cid", value: "bafybeihcq5zz6k3xdgmwyjmsnd5suycgt5dfibqossqlnxae6rqqlijdjq?filename=projektmelody-chaturbate-20200209T014010Z-source.mp4" },
  "5wAScP": { name: "cid", value: "bafybeidd3kw6xd5qwyhwszfbq4bnjd5ilgnti6yd2org2j42z2olaqfcuu?filename=projektmelody-chaturbate-20200209T014010Z-240p.mp4" },
  "OIcdfn": { name: "cid", value: "bafybeifzzi75tf66nmebl6bkq2lllv4d77xarwwhqvuoaib4revoegw5f4?filename=projektmelody-chaturbate-20200209T181400Z-source.mp4" },
  "SlcxG8": { name: "cid", value: "bafybeih2p2h5sy5lrchk5fbxnlnyzzfan5e4zdjkq5ly6smawmdgmrbwgu?filename=projektmelody-chaturbate-20200209T181400Z-240p.mp4" },
  "3s0TJk": { name: "cid", value: "bafybeidcbunf3spndcnuyzv6z3pbuaziq57asgo7rad6qi6ghlpcekpvxm?filename=projektmelody-chaturbate-20200210T021555Z-source.mp4" },
  "BjHNr5": { name: "cid", value: "bafybeieobzv466kqz3i3x3wroxcmokdu5bpkjxbih7sbavlaoy5dsvfj5q?filename=projektmelody-chaturbate-20200210T021555Z-240p.mp4" },
  "v_F4Vq": { name: "cid", value: "bafybeiczjucsseyz5vyei7wropqqdgrbwi563wxx5tkxyqxd22qqtpwjua?filename=projektmelody-chaturbate-20200212T011148Z-source.mp4" },
  "IjA9E1": { name: "cid", value: "bafybeiemhbiywch4io5uiqjagfwvjkmbtzv7btmleq4y4jjyg6wrf6uj5q?filename=projektmelody-chaturbate-20200212T011148Z-240p.mp4" },
  "Aks3q5": { name: "cid", value: "bafybeidlj6qwjzfbe4bgaam2awcb4ztoemndeimpxiivg3tme7wvsumh6i?filename=projektmelody-chaturbate-20200212T171412Z-source.mp4" },
  "E5H3Tb": { name: "cid", value: "bafybeia47gy5ja4m5ulyzjkezx2yrqtz6ybxfm3v2afu2h3zhpxoxkdaoi?filename=projektmelody-chaturbate-20200212T171412Z-240p.mp4" },
  "cpbjZ-": { name: "cid", value: "bafybeib5h2bcn5hsmjrbokq76mqm3xhyelmmpgvdbqhw7lzcauj3zxulty?filename=projektmelody-chaturbate-20200213T020911Z-source.mp4" },
  "7hS2QB": { name: "cid", value: "bafybeicag6jus7lpb3yqcxk7twvngtzkumtq3vojhn2nayp2yslhq4bzh4?filename=projektmelody-chaturbate-20200213T020911Z-240p.mp4" },
  "r8m_2b": { name: "cid", value: "bafybeigwddjxk4d5hjjnzahzbwv5alg3gv2lofqzr5cezjrzhwjbf56c2q?filename=projektmelody-chaturbate-20200214T021300Z-source.mp4" },
  "G-f0Co": { name: "cid", value: "bafybeiargann65kfkcdgk56eyxej4ttnkdsqr5ny25hk4sgtkvbee7fbae?filename=projektmelody-chaturbate-20200215T021356Z-240p.mp4" },
  "3h_pqg": { name: "cid", value: "bafybeiakdc6glw32zj5py24332ty5o77jgv4mfkboauqw3tg3wisvxrs6e?filename=projektmelody-chaturbate-20200217T010540Z-source.mp4" },
  "zeQ5SF": { name: "cid", value: "bafybeigy5eadgvnkqnnafe4jsygyrx6qbsjalqctcpc3xfvnwznrqfdh5y?filename=projektmelody-chaturbate-20200217T010540Z-240p.mp4" },
  "n3OybR": { name: "cid", value: "bafybeibqzj2xikso3l5vfnvlukj3o5kmuscmmlmg7tbk6znlmab2dsrzim?filename=projektmelody-chaturbate-20200218T211700Z-source.mp4" },
  "buFGIw": { name: "cid", value: "bafybeiakuxmllwwyvehruf65r3cmmm2qhi4krvbcm6auf7ojawuzej7dpy?filename=projektmelody-chaturbate-20200218T211700Z-240p.mp4" },
  "IfSclm": { name: "cid", value: "bafybeiccnk7kg3a4nhe7c43v3c2xvob2qndfojghsopefl76clhmaojeua?filename=projektmelody-chaturbate-20200220T010647Z-source.mp4" },
  "hWVKUg": { name: "cid", value: "bafybeigt4vhwjjoeztrvmrgfl23utpwb4nqvzepe7dvkvmrntlwovcc3ra?filename=projektmelody-chaturbate-20200220T010647Z-240p.mp4" },
  "aVrqF_": { name: "cid", value: "bafybeidsmzbzshxgex5wka37jmiqbnc56oq6tni4gpizelecbx23wira74?filename=projektmelody-chaturbate-20200221T162547Z-source.mp4" },
  "eHd24u": { name: "cid", value: "bafybeig6xwrpvt4enmaowwtiqor5772namw7v7iimqt65g6rby3sa6h3rm?filename=projektmelody-chaturbate-20200221T162547Z-240p.mp4" },
  "CaGZX5": { name: "cid", value: "bafybeigjndlwicu6iqv7pomni5a6qhl3oxeopzxugi4rqaqnlqvnjlhxny?filename=projektmel$" },
  "QbBxfl": { name: "cid", value: "bafybeiecppzbxijtcym3t56l45fdaijjucqi46lpi7ropddjbvwp5kfuc4?filename=projektmel$" },
  "4cQKez": { name: "cid", value: "bafybeidflielopp3tl3ig5co6nt2gddjsmdeukg2iixkkmb3ilsue4e454?filename=projektmelody-chaturbate-20200225T213141Z-source.mp4" },
  "Yqdyav": { name: "cid", value: "bafybeicmkiucw36fwzsi7hzvqnxt7s4yzsu25w5otulr4ownq3lcndt5vq?filename=projektmelody-chaturbate-20200225T213141Z-240p.mp4" },
  "8sJr_j": { name: "cid", value: "bafybeib2m5paynnzntjqiu37bx7t37qo6sii2bxs35mqiau4hxlqrfyeku?filename=projektmelody-chaturbate-20200227T011055Z-source.mp4" },
  "xtYFxD": { name: "cid", value: "bafybeifdfo55hlrmogrc72dfiiufcp7q6mohcbufju5wwzgrjogwiz4qlq?filename=projektmelody-chaturbate-20200227T011055Z-240p.mp4" },
  "BFyxKe": { name: "cid", value: "bafybeihprap6r223qrre422uszepedmikl5ilpnpx2qgcmrq5nup3e3s2u?filename=projektmelody-chaturbate-20200228T163843Z-source.mp4" },
  "sdOk2m": { name: "cid", value: "bafybeicp5lhtjhz4bw7t5jwxzqbsvdomiqjayuco2xt54wngmffacffagi?filename=projektmelody-chaturbate-20200228T163843Z-240p.mp4" },
  "Ukevr5": { name: "cid", value: "bafybeihejcsqwcbf7nvoyrjk4xwstbtercu7wkgg6wjvkshmej5ee7jcgy?filename=projektmelody-chaturbate-20200301T011402Z-source.mp4" },
  "PVVjL1": { name: "cid", value: "bafybeih7nslfzfxaqyqk34aicxe6rfvnlvgbdkxzkkvvoerrlim2jz5mim?filename=projektmelody-chaturbate-20200301T011402Z-240p.mp4" },
  "u2lN9e": { name: "cid", value: null },
  "gF80zB": { name: "cid", value: null },
  "kq52ZB": { name: "cid", value: "bafybeic7bdu7jwr53h3rxie6b776imp7zoxalumkflsvdpmcz3d252shfa?filename=projektmelody-chaturbate-20200303T210617Z-source.mp4" },
  "KU2tKM": { name: "cid", value: "bafybeihdina7wohw7isrd5zxlbneui6lf2aj7cmpxnnd4rs5qgtttrw7yu?filename=projektmelody-chaturbate-20200303T210617Z-240p.mp4" },
  "_hG9uG": { name: "cid", value: "bafybeiea2cmdlzeavouhgvg2wzwi2wtqyw6ahtyeonyfn5ka47tqlj6ql4?filename=projektmelody-chaturbate-20200305T011807Z-source.mp4" },
  "rFC8uZ": { name: "cid", value: "bafybeieu6wqcujklb2onpsnctaed2ic4g6xw3r4rlura34kbdc325qpl2m?filename=projektmelody-chaturbate-20200305T011807Z-240p.mp4" },
  "jM65jF": { name: "cid", value: "bafybeifbzoiixv4qfii7u56avdx3b2uxx5fuekwngw7anddkoptnig7c3a?filename=projektmelody-chaturbate-20200307T024052Z-source.mp4" },
  "2OKJZy": { name: "cid", value: "bafybeiftkp3cvtmb5p4p6usghssj34ctlmxxpmnbianzpfnsau3mluhdgu?filename=projektmelody-chaturbate-20200307T024052Z-240p.mp4" },
  "Q5AP-m": { name: "cid", value: "bafybeicz3irnef5rquxpht75ncvym2twordnavelh43yjgubmjemy4alkq?filename=projektmelody-chaturbate-20200310T220051Z-source.mp4" },
  "pXKQN6": { name: "cid", value: "bafybeidc2vzw52vpz5f2o7zcuuz7jvqfrjbxwozr6zi2axmmrzd2zz5fuy?filename=projektmelody-chaturbate-20200310T220051Z-240p.mp4" },
  "1k03Kj": { name: "cid", value: "bafybeicsagfv5wicwpo3ity2phcu55osocogejgz52fk5xleak2fsptkse?filename=projektmelody-chaturbate-20200312T000106Z-source.mp4" },
  "6gbPQs": { name: "cid", value: "bafybeicujl5burg2kdflozpt3mu63ggs7euxt7o6r2m5ae5c5lm4jjet7i?filename=projektmelody-chaturbate-20200312T000106Z-240p.mp4" },
  "IKHxTZ": { name: "cid", value: "bafybeie6pjk42lxh372j6kiwoe3evb6mgwu3bhib37lq5pop6ysbtjmfle?filename=projektmelody-chaturbate-20200314T013859Z-source.mp4" },
  "DBHQkx": { name: "cid", value: "bafybeiftuoe5dw2ek6i34dcisa26grbvpss565puptn3olcxmmhexykfoq?filename=projektmelody-chaturbate-20200314T013859Z-240p.mp4" },
  "cgl-u8": { name: "cid", value: "bafybeigceik62tpvp2srniu7ljnqzcugkzvsz2uu745dvunlcmz7hoahyu?filename=projektmelody-chaturbate-20200315T202240Z-source.mp4" },
  "in_WCk": { name: "cid", value: "bafybeify7wz6e7jspx2jhrioeorkguocsbw5fqz3eoqcakcjaiwq36d3hu?filename=projektmelody-chaturbate-20200315T202240Z-240p.mp4" },
  "biFdvn": { name: "cid", value: "bafybeicgo5mrlfbcnbpqzhkk2pkc67fmq2hfhph4lstrcys2fy6rpjginu?filename=projektmelody-chaturbate-20200317T195546Z-source.mp4" },
  "yFsah9": { name: "cid", value: "bafybeiftnzepa5fwy5dpntnxhgpegdx7tnp6x5s6ksx2qwi4pffcxb2ele?filename=projektmelody-chaturbate-20200317T195546Z-240p.mp4" },
  "sPkyql": { name: "cid", value: "bafybeibanfgyvhk56534z5ireuwhtkagsqruqxwl6c6m5pxk4plgdp4fj4?filename=projektmelody-chaturbate-20200320T154136Z-source.mp4" },
  "JGcpiP": { name: "cid", value: "bafybeibbzp5w5appf6ls4f6pjf3prla2vebyfwbyzz7hd6n2em4qyerrrq?filename=projektmelody-chaturbate-20200320T154136Z-240p.mp4" },
  "3A1C4O": { name: "cid", value: "bafybeibalp6tucbwkgiu6eklkq4ifxcwu56n5o3xdiwhgunqgswp3x3gay?filename=projektmelody-chaturbate-20200322T001112Z-source.mp4" },
  "lUwqOC": { name: "cid", value: "bafybeid4kfsf6o76t22gpjaqvuqsrvzldlj4eaqsfxqcfzycbefjjv6fai?filename=projektmelody-chaturbate-20200322T001112Z-240p.mp4" },
  "qkPFdm": { name: "cid", value: "bafybeihkyxrqs77xllauqwxu74jfsc3gsajicjkmr2b2e4jc7pftpc5are?filename=projektmelody-chaturbate-20200326T001456Z-source.mp4" },
  "OzjAVz": { name: "cid", value: "bafybeierspexvb3ahmoa3jtzmduecmyesakpg5hhoeqnsuikr6nhh23afi?filename=projektmelody-chaturbate-20200326T001456Z-240p.mp4" },
  "GTmvJV": { name: "cid", value: "bafybeicllik54s7xjfurn724rsq7f5gacm4uxeauzmq2dytvxwmp5djqnu?filename=projektmelody-chaturbate-20200328T014221Z-source.mp4" },
  "4-Rprc": { name: "cid", value: "bafybeiee2hxku2zdpfalrke6vhltwzqs334cvi26fpuxjczbp6nhkmmyji?filename=projektmelody-chaturbate-20200328T014221Z-240p.mp4" },
  "cwno0v": { name: "cid", value: "bafybeialrynbmirk6bqwy4gpeynxxiee6hfzotga4utednrcgasjpmzm2q?filename=projektmelody-chaturbate-20200401T001326Z-source.mp4" },
  "_w-dQn": { name: "cid", value: "bafybeieitsayexldi5froqo3ycdmfx4emnb5gjfnefs67a76yzs2spdpmi?filename=projektmelody-chaturbate-20200401T001326Z-240p.mp4" },
  "tnoOl4": { name: "cid", value: "bafybeify7pynayufjn2seurcriibhngd6elfht65j2k75oej4spemye4um?filename=projektmelody-chaturbate-20200402T001139Z-source.mp4" },
  "XHTRHl": { name: "cid", value: "bafybeidoudfjsr4xvzmhzfopc3h2l45cmhvp5iunkbluq3wjskukvymrnu?filename=projektmelody-chaturbate-20200402T001139Z-240p.mp4" },
  "igoRgl": { name: "cid", value: "bafybeiajaapyt3vapnvywguy5pq3tofxba7qn76dsvp6bggqcolouoeaae?filename=20220405.mp4" },
  "ZFxliP": { name: "cid", value: "bafybeibvskcysgkk6ouozq6mgkvnsj2ht3ddmmueo22duucsxvsyr6iohm?filename=projektmelody-chaturbate-20200405T225516Z-240p.mp4" },
  "MMU9zy": { name: "cid", value: "bafybeiecfllwdwpxhoymmgnnqlbgwujjceusif3y7fw7nbghv3t5jbgvcu?filename=projektmelody-chaturbate-20200409T000624Z-source.mp4" },
  "oPEKro": { name: "cid", value: "bafybeid77mywot3ile7yylqzqrh4egcrrw37gdyfme2qckj4mghku7gpai?filename=projektmelody-chaturbate-20200409T000624Z-240p.mp4" },
  "hee07A": { name: "cid", value: "bafybeigi6tlva7widakaoqbbau3xdvba7bt75cipao4k5ulehi6kdj6mka?filename=projektmelody-chaturbate-20200414T195703Z-source.mp4" },
  "UnlTl9": { name: "cid", value: "bafybeiarqn3rctng4cxxpyaxy7yukuodommta5mqwot3n6x4k75fiky6m4?filename=projektmelody-chaturbate-20200414T195703Z-240p.mp4" },
  "6AicVz": { name: "cid", value: "bafybeihg3cjhbkfp6bliyhpeki73xs562rqhhnufnm5jio72esqwz2egpi?filename=projektmelody-chaturbate-20200424T005516Z-source.mp4" },
  "sxL14i": { name: "cid", value: "bafybeiflgictk46q7r5fvjreurvdytzhtexjobpgta5ba3iy5npy2uoeoi?filename=projektmelody-chaturbate-20200424T005516Z-240p.mp4" },
  "ft4N7C": { name: "cid", value: "bafybeievzg6xerguxfeufchhxca2zjj4w4yypgynbxaeygmmujk6a74tum?filename=projektmelody-chaturbate-20200425T230542Z-source.mp4" },
  "3CA5-P": { name: "cid", value: "bafybeiglj43ebp7ue4vykubdygi6pbakvwivyjc5xvknagadkd4bvpi2ee?filename=projektmelody-chaturbate-20200425T230542Z-240p.mp4" },
  "hGYPak": { name: "cid", value: "bafybeib4m6pwp6jtxrcsikktmdeug6dus32c7vrmboncurpzf5o2jdnqqa?filename=projektmelody-chaturbate-20200426T225450Z-source.mp4" },
  "J9dr-w": { name: "cid", value: "bafybeia37rn2m42uc5st5m2hlgrcl72jsfmun2r5d247slywk6gf3rfud4?filename=projektmelody-chaturbate-20200426T225450Z-240p.mp4" },
  "ixyEQU": { name: "cid", value: "bafybeihp4kns5jpxombjcfymkcotqo4z6gaamtqieceiyq2ejpct6vkfxy?filename=projektmelody-chaturbate-20200502T220133Z-source.mp4" },
  "ySpuIV": { name: "cid", value: "bafybeigz4jatjfrr4cf252m5oygtjti443aasp2th6t56qjhskvc4mwfxi?filename=projektmelody-chaturbate-20200502T220133Z-240p.mp4" },
  "G0ZEeV": { name: "cid", value: "bafybeibmcakf45uxoyz6tzwlnzayacli3la4qdktegxpg5dlvquilophta?filename=projektmelody-chaturbate-20200505T190056Z-source.mp4" },
  "k3uwt0": { name: "cid", value: "bafybeicjmfy3jmiwwf63acf6wojl7e3f7s57zaholzcfcszdizcgtoa3gu?filename=projektmelody-chaturbate-20200505T190056Z-240p.mp4" },
  "t1FU2x": { name: "cid", value: "bafybeig4b54dil42fz63v6rj72dltlm5dpzrphpj34lmn7grkquwh4izqa?filename=projektmelody-chaturbate-20200509T215916Z-source.mp4" },
  "7FjIiF": { name: "cid", value: "bafybeifzkgcmueg67mhi6gr5juwannmbbupstxruxzesxuhzrsstr6kuwa?filename=projektmelody-chaturbate-20200509T215916Z-240p.mp4" },
  "Q-DafE": { name: "cid", value: "bafybeih3pqcdankhhfengw4es2fcnpactxpegkikz7szc3xkbx5wgak6xq?filename=projektmelody-chaturbate-20200512T190153Z-source.mp4" },
  "waSJ75": { name: "cid", value: "bafybeia24h6z6iddzcbizqlcwcxelwy6ssrlak5e72ioc6ootjh5c3ruzm?filename=projektmelody-chaturbate-20200512T190153Z-240p.mp4" },
  "77pFEt": { name: "cid", value: "bafybeiejsr5qtrorw2gqjzfun6ryptqlf3ykwozklnyyxflilcn24mz6iu?filename=projektmelody-chaturbate-20200517T000730Z-source.mp4" },
  "bLPRQ5": { name: "cid", value: "bafybeifrabqbyddyoesolohzdzmhal3orayk4kpkqpvv3vg6bq6taikw7u?filename=projektmelody-chaturbate-20200517T000730Z-240p.mp4" },
  "VceYom": { name: "cid", value: "bafybeigrcl7ijes55tv7pat6bnoeujm6daoi4n5exwx62rv36mmww3emai?filename=projektmelody-chaturbate-20200520T011656Z-source.mp4" },
  "a-7BZL": { name: "cid", value: "bafybeifqnz6rfkl7yqoprq2isydteud3zmblog4t5scgaxd6nvpsvuuinq?filename=projektmelody-chaturbate-20200520T011656Z-240p.mp4" },
  "OUgsvp": { name: "cid", value: "bafybeihggyg54iqrjsvcmrnihwoq54xtqkpznnsao47nhwopmkcmnslv5a?filename=projektmelody-chaturbate-20200523T000300Z-source.mp4" },
  "7ZPnc8": { name: "cid", value: "bafybeiah6tulsqjwfstd6q3evzxpqltn6lfl4lz2kf4dzzrxf2natrnlke?filename=projektmelody-chaturbate-20200523T000300Z-240p.mp4" },
  "DbrvhQ": { name: "cid", value: "bafybeiahwzppno5fp4mobpkijjiwwkjbeto2u7lksninhybwk5vgnbw2qa?filename=projektmelody-chaturbate-20200528T195730Z.mp4" },
  "ryuYmX": { name: "cid", value: "bafybeieh6t4zd2b5bdau42zbissoscbvu5ftd4dysvitqr24ecc2k2lb3i?filename=projektmelody-chaturbate-20200528T195730Z-240p.mp4" },
  "eEBF2s": { name: "cid", value: "bafybeiasbueh5dyk7nqo3qzu4kyvrhnf54oiys3rz66it6qx43bf6mimfa" },
  "RkXP6-": { name: "cid", value: "bafybeidv4mmqz2f5jkqnp33prnxgzabyn2w2yggrwtvmkjp6jrax7bivvq?filename=projektmelody-chaturbate-20200529T230207Z-240p.mp4" },
  "eUPvOr": { name: "cid", value: "bafybeifiesqa7byedil4x4chjllk3man6zskchvxkpas6k6xid5ie4d2di?filename=projektmelody-chaturbate-20200601T001353Z-source.mp4" },
  "XVmXV0": { name: "cid", value: "bafybeiexdwavn3ftr6t3kk4anzbr5jidqxuhvr3dwrrunxdwdpkvyf5vna?filename=projektmelody-chaturbate-20200601T001353Z-240p.mp4" },
  "QLHtu2": { name: "cid", value: "bafybeiflu5ns2auqvqlpxqu2cqprmmn3gjgvxt72akd5kdbhnakyewcyhq?filename=projektmelody-chaturbate-20200606T000211Z-source.mp4" },
  "1mCvUJ": { name: "cid", value: "bafybeifdnntqpjizs4jtp5gnzrdvkuk57bwfzkgfocqmawlkqu7mksfxy4?filename=projektmelody-chaturbate-20200606T000211Z-240p.mp4" },
  "DgPFQG": { name: "cid", value: "bafybeig6wi5nbi64bedu6lxkd7ddkgcnagblhds4wvcfux5crgfubv5avi?filename=projektmelody-chaturbate-20200610T185826Z-source.mp4" },
  "y637am": { name: "cid", value: "bafybeigind6yynxuzazzhhscsx5xobmuygeldd5flsv7qezxjhzpidgqty?filename=projektmelody-chaturbate-20200610T185826Z-240p.mp4" },
  "HmqRrv": { name: "cid", value: "bafybeieoy7fjd2x7pvf6jqu6pirrsleycxqto5rn4fgpdmqfzve2h56g3m?filename=projektmelody-chaturbate-20200616T185504Z.mp4" },
  "MiglDN": { name: "cid", value: "bafybeib6z7nd4fznlfelmaevisqgmfvpz3jnr62k44q5xx64z2yh2hqyki?filename=projektmelody-chaturbate-20200616T185504Z-240p.mp4" },
  "RkcjyN": { name: "cid", value: "bafybeifffrtocxxs3fz4bmvhuo6tjsvyfmdkwdasfv6nvrllv4m6pz7lha?filename=projektmelody-chaturbate-20200618T233757Z-source.mp4" },
  "-4E5x0": { name: "cid", value: "bafybeiggc5kvwf5so4gjejiuehv45odxwayue64yggxs33lquaqfx2ayhu?filename=projektmelody-chaturbate-20200618T233757Z-240p.mp4" },
  "SV5fyg": { name: "cid", value: "bafybeihtspswyyjcz7zcnvfmldzpp6eioarry7apmmplv7wg3xrx5bh4wa?filename=projektmelody-chaturbate-20200621T000909Z-source.mp4" },
  "dE2ONJ": { name: "cid", value: "bafybeicun6pgmejqnbtlrqfjid2fvdolahzrilchpyindmcpxacbqjukrq?filename=projektmelody-chaturbate-20200621T000909Z-240p.mp4" },
  "29WKba": { name: "cid", value: "bafybeihrixodbrz2iniq67tlvm5woau6tfm77ryeskmis5id7gobv4dxhy?filename=projektmelody-chaturbate-20200623T200012Z-source.mp4" },
  "Bvi1zF": { name: "cid", value: "bafybeih4ufn2px6ehbikgksmppw4yqz72dqeh6qjotvj63cya24afdwwem?filename=projektmelody-chaturbate-20200623T200012Z-240p.mp4" },
  "XvuqgW": { name: "cid", value: "bafybeidlqaobmf6a62x2n6mufniaiaybap22y2tujr4aqak2hsoimm254u?filename=projektmelody-chaturbate-20200627T000639Z-source.mp4" },
  "fk64OI": { name: "cid", value: "bafybeie634ekubstzaokbtujado6dsubzxftqbgc6g3ykgmfis7iyl34li?filename=projektmelody-chaturbate-20200627T000639Z-240p.mp4" },
  "7YPj-g": { name: "cid", value: "bafybeiendtjqhjazyeovym6erix6zusmvklmie5sfvnj7m3y4mc7hintzi?filename=projektmelody-chaturbate-20200628T001007Z-source.mp4" },
  "MNLPNG": { name: "cid", value: "bafybeigvfnboz53yo4676zkrhzyfacanmfxvpg36xvrl5xqjqc34pq6o7a?filename=projektmelody-chaturbate-20200628T001007Z-240p.mp4" },
  "wCqEmZ": { name: "cid", value: "bafybeibtxscx5cks5hscfg2fbzykpmhenyevltpn6k2nyp5kpzn6zizrjm?filename=projektmelody-chaturbate-20200705T000206Z-source.mp4" },
  "wSmPk0": { name: "cid", value: "bafybeicgt37whdpvfqkovbuwombwryjobqxqttj3cfamdhvqxdbyhhkbzu?filename=projektmelody-chaturbate-20200705T000206Z-240p.mp4" },
  "sLzsWA": { name: "cid", value: "bafybeidv5jbqxtfcblyr7pibbdmzf3eoiarbo5c7tqirqrjzjzyl7was5y?filename=projektmelody-chaturbate-2020-07-06.mp4" },
  "3RJPZU": { name: "cid", value: "bafybeic2nicme3ad7rsjfdebzuoyo6qb7id6eu6ixhz423hcb3rwk4et34?filename=projektmelody-chaturbate-20200706T200301Z-240p.mp4" },
  "FuQm1C": { name: "cid", value: "bafybeiclvtb654ace3cy6r4sfj36msqgrgy6wpmp6hwcczsahutqv2tm6a" },
  "8iNIFx": { name: "cid", value: "bafybeiaxeyktqqxq24swrlye2wwo667gulixobntcxq7vwl7lx74jjzjju?filename=projektmelody-chaturbate-20200707T205926Z-240p.mp4" },
  "GpIWil": { name: "cid", value: "bafybeihyzwcnhziqtdcnagbfyz2e4vavldoxmmp2oo7lkpm7vbkxeh5yyq?filename=projektmelody-chaturbate-20200710T235934Z-source.mp4" },
  "KpqDzi": { name: "cid", value: "bafybeiav3szdqqrwxheucjqbklhrms2htpjenlzbdtcxxsjdbromvs7oiq?filename=projektmelody-chaturbate-20200710T235934Z-240p.mp4" },
  "90Pf-b": { name: "cid", value: "bafybeih5avhskuneiyi6rmv6wgbrym5zuppbgzbrgeh67dt2uyejwhdcha?filename=projektmelody-chaturbate-2020-07-15.mp4" },
  "NoXY1p": { name: "cid", value: "bafybeig4jkqpvfds6bhmp3qmk5z26mnnfifjvnf3tlegrvveqhzmesjoam?filename=projektmelody-chaturbate-20200715T002549Z-240p.mp4" },
  "ehRGXT": { name: "cid", value: "bafybeigb73lspj5w74uqiokew3fxi3y2su7xrfkmdwjpfnolzfewxirpwu?filename=projektmelody-chaturbate-20200718T011451Z-source.mp4" },
  "aH2Okf": { name: "cid", value: "bafybeieu6qb3t4egku5w3jlrjymqkqp4hvbikjw2s5e2pgfwhz7gg3jl24?filename=projektmelody-chaturbate-20200718T011451Z-240p.mp4" },
  "oqarUH": { name: "cid", value: "bafybeia3utcqtuzu6sgcj5wuhpf7gtp5gwgcuvuj7bojeur2zu3um2tg6y?filename=projektmelody-chaturbate-20200725T000005Z-source.mp4" },
  "ReunSH": { name: "cid", value: "bafybeidmtua4tsjfirpfoglwls72zirreykdas6an74f74gbq26gwdac7e?filename=projektmelody-chaturbate-20200725T000005Z-240p.mp4" },
  "um1BIL": { name: "cid", value: "bafybeibvsokqiparm4l7x5ggaoyddd6wnep6zgtujsme2rjfhdrlg7b46q?filename=projektmelody-chaturbate-20200729T200340Z-source.mp4" },
  "0ifStB": { name: "cid", value: "bafybeig6jl5sizmkv5mbdsj3efzuoaro2x3yxee6idndcuwpqn442ig6hy?filename=projektmelody-chaturbate-20200729T200340Z-240p.mp4" },
  "pjRDSk": { name: "cid", value: "bafybeideblepxcn4n2fahjzogdczks2dwrrqc42ggwgq42x74gkllt36fa?filename=projektmelody-chaturbate-20200801T000000Z-source.mp4" },
  "TH5WOR": { name: "cid", value: "bafybeidotr3q7xf7mdy3hxllrdav6dfkfpela2jvon6tqsoxhpo3ue7qoy?filename=projektmelody-chaturbate-20200801T000000Z-240p.mp4" },
  "rzIqkA": { name: "cid", value: "bafybeieuseafqywes7slgys2r7exn6dgrrglk5qnbpk4lgoiy3npgaew4y?filename=projektmelody-chaturbate-2020-08-05.mp4" },
  "otKAmQ": { name: "cid", value: "bafybeihg73lhct34xbhiyt7vablwuaghtn6abon5g4vbxncfovmu2dz5hq?filename=projektmelody-chaturbate-20200805T195240Z-240p.mp4" },
  "Stlm8r": { name: "cid", value: "bafybeihjdmdmpl5yglkmspkryztnofcdxfnoxl6bvnnvxtocafvrlkyeae?filename=projektmelody-chaturbate-20200811T230122Z.mp4" },
  "Qff3QZ": { name: "cid", value: "bafybeibhui3rnusxr24ay6hwbskrzzz5wum2imona7r4l7mevhdv375nyi?filename=projektmelody-chaturbate-20200811T230122Z-240p.mp4" },
  "Rsg4N9": { name: "cid", value: "bafybeiebnhw3qmiwcz7acpindes5ccerd37i7j2theu5z3h3ipijixflc4" },
  "f4lp65": { name: "cid", value: "bafybeihijt33vgubejsmhukfj2kqwlt3zdenipl5oer3no5rkihhqqf5ge?filename=projektmelody-chaturbate-20200814T222159Z-240p.mp4" },
  "kZmS0z": { name: "cid", value: "bafybeiew7aifotubyyc4fhwnbtzcfnslmyzisnvvkf2rqvqyceswjizbe4?filename=projektmelody-chaturbate-2020-08-19.mp4" },
  "jrhcZW": { name: "cid", value: "bafybeigf47vbeatbass3fydjfekoc22zgskcphhecy32np5gx44fxshayi?filename=projektmelody-chaturbate-20200819T210011Z-240p.mp4" },
  "PqjGGa": { name: "cid", value: "bafybeife7faqnxwrrpdqqphbyl4ldh4ah7sw4ng7ee6vzyhxlxeajanelm?filename=projektmelody-chaturbate-2020-08-22.mp4" },
  "plKlfR": { name: "cid", value: "bafybeiawpiz4jjpl5v5evmuvg26ogety646qrx5nlrs5lfpcxhj2lls5ne?filename=projektmelody-chaturbate-20200822T000348Z-240p.mp4" },
  "bPPUC_": { name: "cid", value: "bafybeigdsxefrigiv3qvjz3utnammolu2xlvvudglav5b2so4yqlhvwn5q?filename=projektmelody-chaturbate-20200823T225921Z-source.mp4" },
  "kXRtdl": { name: "cid", value: "bafybeicmnk7km2rodpdai7muzanfoieck7642qddx52cgoe7h3367hfucm?filename=projektmelody-chaturbate-20200823T225921Z-240p.mp4" },
  "TuGWPJ": { name: "cid", value: "bafybeicigkh3htpafr6ycxyaznco74qb36gkox3gpv43djlvh37acghbhq?filename=projektmelody-chaturbate-2020-08-28.mp4" },
  "pQVxs4": { name: "cid", value: "bafybeia3vdp7w3qjyjdh7prlgag4pwjbvoj6i7yhvdjmfcykio3mobuwuq?filename=projektmelody-chaturbate-20200828T230316Z-240p.mp4" },
  "zzOXOo": { name: "cid", value: "bafybeiakxbfx343aya43n5w7pnedkvjiffwa2dvf6meau5ct4qd7i66cre?filename=projektmelody-chaturbate-20200905T230812Z-source.mp4" },
  "Cs51MT": { name: "cid", value: "bafybeiedesne5oeg6asbyczdeeapqcftdhnd2em63qcbhkqofvqdbiqmyi?filename=projektmelody-chaturbate-20200905T230812Z-240p.mp4" },
  "fFNokI": { name: "cid", value: "bafybeiawbkiq4h3brgxfja5i4lre3o23ruafbtpudcxfyvw6kc77euc4si?filename=projektmelody-chaturbate-20200911T180231Z.mp4" },
  "zoC44p": { name: "cid", value: "bafybeihlkq4o33qta3ld5hym6ubn6lzvl5xovtov77nbriekaa255wst2e?filename=projektmelody-chaturbate-20200911T180231Z-240p.mp4" },
  "VMAoiR": { name: "cid", value: "bafybeibeg2fbx344chofjquyfgmpdflg33m54puli23gv6izxhtxv6araq?filename=projektmelody-chaturbate-20200913T230049Z-source.mp4" },
  "HWzWHF": { name: "cid", value: "bafybeih5iiimkrgza5yrj7uwmfpvqexnpgmix5ve2zlztezoliib3p36gq?filename=projektmelody-chaturbate-20200913T230049Z-240p.mp4" },
  "qlHXTc": { name: "cid", value: "bafybeigugsgu2sr3vcovz6t23ggjlrxlgxmvzrp4ujqjcsprvxkrsyvh3q?filename=projektmelody-chaturbate-20200918T225513Z-source.mp4" },
  "6jXq92": { name: "cid", value: "bafybeignfro66oreh3kmr4hodzzzwns6bxqes24sd2h2cztarhom4rmymm?filename=projektmelody-chaturbate-20200918T225513Z-240p.mp4" },
  "H_Ua80": { name: "cid", value: "bafybeihlzbvgyyrmtc2dw2ibvympl5v2abtl7fnwbbhjopd3ckvbfjeyme?filename=projektmelody-chaturbate-20200920T200012Z-source.mp4" },
  "EXh5vF": { name: "cid", value: "bafybeib2gtbcyr7nya373ldw3jdiyupwglgjqwvsfm2w2wziqozww2hu4y?filename=projektmelody-chaturbate-20200920T200012Z-240p.mp4" },
  "f7stkX": { name: "cid", value: "bafybeif5dqfylhlnsyc42vqybe77aqmvfntnjhzjncmeo4li6zpvncrazq?filename=projektmelody-chaturbate-20200924T232558Z-source.mp4" },
  "JXuAeu": { name: "cid", value: "bafybeihk6r7wp5yymjclyp3h6juzblqeqmgi2my6fy4qplp2w7htnr46cu?filename=projektmelody-chaturbate-20200924T232558Z-240p.mp4" },
  "c9uGEp": { name: "cid", value: "bafybeiem46df6x6fv3fuplwz7jxk7qiwfpoowwt2nov4wsomfy27yuh66i?filename=projektmelody-chaturbate-20200928T201436Z-source.mp4" },
  "jHAlWT": { name: "cid", value: "bafybeig3qo6eghqxsewomwnhyyukumnltpmvsblupdusvwmrh2alykyylq?filename=projektmelody-chaturbate-20200928T201436Z-240p.mp4" },
  "uoyqEs": { name: "cid", value: "bafybeibhvnylayjzn5zpt3yzeoqotgvwpqe6ltiky6bmauh6euj7kdwohq?filename=projektmelody-chaturbate-20201002T234802Z-source.mp4" },
  "ODL6sX": { name: "cid", value: "bafybeihz3p2ojj67bebqu2hcsu45zlpo5hf7tjcuzlsv6mergfhdclj4nm?filename=projektmelody-chaturbate-20201002T234802Z-240p.mp4" },
  "pcOoL4": { name: "cid", value: "bafybeigyk5hnfrybipzwshgfrtutv4sddi2xbyum4lyr6tofqsrnlnfsa4?filename=projektmelody-chaturbate-20201006T225913Z-source.mp4" },
  "dX5tgQ": { name: "cid", value: "bafybeiaxi4liv5nzpvrpcow6ydro2i53vosmupqsqb5x4ckdxsxvn6c65y?filename=projektmelody-chaturbate-20201006T225913Z-240p.mp4" },
  "7fKv1N": { name: "cid", value: "bafybeiaeimkku5e7ivca34ijgc5d2h5hftndcax4e7cwoczb23ioum4qtq?filename=projektmelody-chaturbate-20201009T180105Z-source.mp4" },
  "o2yBCa": { name: "cid", value: "bafybeihpvzc54xce2nejl5xqb4mg2hcidlqscoefi4rfagqm44hwp6xp6y?filename=projektmelody-chaturbate-20201009T180105Z-240p.mp4" },
  "jWAlTP": { name: "cid", value: "bafybeie4ilm7qirfk5fa56qm64zfr4cayzgjlpmiiijokubzasjq4d223q?filename=projektmelody-chaturbate-20201011T220530Z-source.mp4" },
  "T14wUB": { name: "cid", value: "bafybeih5fewjslyrn3hwr5bas6td3mkda5wmshbwi7juwbec2wi4nfgpve?filename=projektmelody-chaturbate-20201011T220530Z-240p.mp4" },
  "WxP3OA": { name: "cid", value: "bafybeifnnpcf7olywknb7zb2obkpzk3q5nfrknkcynuri5ng2pohznjqty?filename=projektmelody-chaturbate-20201013T230314Z-source.mp4" },
  "kBWM3H": { name: "cid", value: "bafybeieacm62v6autl43ekgtiqouzweuvqs36zkth3bi7wzpjtpi6cpi5e?filename=projektmelody-chaturbate-20201013T230314Z-240p.mp4" },
  "nGWbSL": { name: "cid", value: "bafybeid7dppjic72s2klqvajbq63nc2wkslb3tsqpxdmecxs4ilqwzc4qm?filename=projektmelody-chaturbate-20201016T233250Z-source.mp4" },
  "mxLCsn": { name: "cid", value: "bafybeicggfgduwqxoojtxulcjlr4dzws7ehfwcfmkmezwjm7vy6vtck6lq?filename=projektmelody-chaturbate-20201016T233250Z-240p.mp4" },
  "1KjCdL": { name: "cid", value: "bafybeiggv4b7xyq2napssrkkdyvrfrh4g4vhoyetxrjxwkrrggmizi3biq?filename=projektmelody-chaturbate-20201018T185938Z-source.mp4" },
  "XZpzhg": { name: "cid", value: "bafybeid3qp2w2zprpwbohhfikyx5dfnafox5gkr4p7bql4fpejpznseiba?filename=projektmelody-chaturbate-20201018T185938Z-240p.mp4" },
  "0lHBVr": { name: "cid", value: "bafybeia2qwxtuavj6yvqmksu2ijt6rkenwlsst7yr745vqlqtkncyijcdu?filename=projektmelody-chaturbate-20201023T185531Z-source.mp4" },
  "g4LG2S": { name: "cid", value: "bafybeih2udcouerbz2zoauk3ntzng3brmjb5wy37lfhkp7uso4gvbaspfa?filename=projektmelody-chaturbate-20201023T185531Z-240p.mp4" },
  "wkMFyz": { name: "cid", value: "bafybeih4h67anwjayy7l3jsqr4zrey7f2qsoaeawmpkge4shdtax734xdy?filename=projektmelody-chaturbate-2020-10-29.mp4" },
  "3I_CW4": { name: "cid", value: "bafybeicbymebmexnxebtpaib2kfdofdifg5wnmvzx47bnht6t47orwv2au?filename=projektmelody-chaturbate-20201029T195810Z-240p.mp4" },
  "dQ2ftQ": { name: "cid", value: "bafybeiajmdaraqvmxrxrjmw2tbmxtgmzo4dg5wu35roqxeooi2vmszw36y?filename=projektmelody-chaturbate-20201031T230357Z-source.mp4" },
  "qAHOxe": { name: "cid", value: "bafybeih7s4awvf43sr5ktinp3srfdpq7f5n2dvknftcfbycfwduigkkeda?filename=projektmelody-chaturbate-20201031T230357Z-240p.mp4" },
  "DFyu0G": { name: "cid", value: "bafybeihpjeoy4ltqfeubli4ei6qd6yvdneyfu3gwusdvscvrwojrlqwnpu?filename=projektmelody-chaturbate-20201109T005559Z-source.mp4" },
  "yOiLyV": { name: "cid", value: "bafybeic3bvkhyzgw5n45cnprmz3r7hwt5vs6alskeve2tbgctcblydp6oy?filename=projektmelody-chaturbate-20201109T005559Z-240p.mp4" },
  "e6djB-": { name: "cid", value: "bafybeic7cv2o75ofddmvb6qah4j5lusiiah72sa7arqtxl5vgia76b7adi?filename=projektmelody-chaturbate-20201118T015920Z-source.mp4" },
  "pyoDVf": { name: "cid", value: "bafybeienm5soj6jsjmz7xdlh7ebldrcgtffoybfghqxh5ossvbocfce5cu?filename=projektmelody-chaturbate-20201118T015920Z-240p.mp4" },
  "pw5mlL": { name: "cid", value: "bafybeiepmb7rt25g5y2lobrba2afkye264n4kxjn54xhvvod3qoqwynxay?filename=projektmelody-chaturbate-20201118T212800Z-source.mp4" },
  "lZGHXJ": { name: "cid", value: "bafybeifakh4e7fslrudoty6nfkatb33bo6vqb3btxf77spjczccmkwj7pq?filename=projektmelody-chaturbate-20201118T212800Z-240p.mp4" },
  "wi17NB": { name: "cid", value: "bafybeiaera7u42nrmtw73kwj6bo5h524t2a7cv7ax25hi3q2ktjubbetrm?filename=projektmelody-chaturbate-2020-11-23.mp4" },
  "SiIQfX": { name: "cid", value: "bafybeifqbe2e2w6zolkbunwiyp7iqp3i2gdt7zzy6hg5c5nk37ewgvldtq?filename=projektmelody-chaturbate-20201123T235604Z-240p.mp4" },
  "WPY5Q0": { name: "cid", value: "bafybeigg25lw3daqmi5jfrkvdqy2exnijcjhqk4v24epk3qvpg6bnwnevu?filename=projektmelody-chaturbate-20201126T220319Z-source.mp4" },
  "XM4QhZ": { name: "cid", value: "bafybeic6jxvfio2636qdq3wu6obggu53waie7viqcak4suogitcktx5pxu?filename=projektmelody-chaturbate-20201126T220319Z-240p.mp4" },
  "11X9DW": { name: "cid", value: "bafybeibf6jowdhbiwgzer426x67b5ubfvkzeiziotooa6rl2q3j7nv6pvi?filename=projektmelody-chaturbate-20201204T211842Z-source.mp4" },
  "na9fC3": { name: "cid", value: "bafybeibmvylhkaeetokiilftcnvpfxbtg6zll5mvulexbknt3hrrvnq72m?filename=projektmelody-chaturbate-20201204T211842Z-240p.mp4" },
  "raB39K": { name: "cid", value: "bafybeidgwlvv75jvr7etr3jer3reiipcgjqzuw6rirxfsvr5lfw5wwdrua?filename=projektmelody-chaturbate-20201207T235641Z-source.mp4" },
  "XciYu-": { name: "cid", value: "bafybeidekz4qws7erfeg6oym2wbvxuvb4pwusk3ya73hjaxw6v4p3cxt2m?filename=projektmelody-chaturbate-20201207T235641Z-240p.mp4" },
  "RhfJGo": { name: "cid", value: "bafybeiehcivilnimtw3e35t3wxx6uc7vyna4nrkq4xpc5kxeili5pg6fmi?filename=projektmelody-chaturbate-20201214T214627Z-source.mp4" },
  "oiHzbV": { name: "cid", value: "bafybeifnso534uclr7bo4sakmmbyqltldj3gnmdlksewtjntzh5dmhx7pq?filename=projektmelody-chaturbate-20201214T214627Z-240p.mp4" },
  "sMqpIw": { name: "cid", value: "bafybeigob4eggjxtafx7d54ijaxkyetml7eoauloqymlowdblgtcbomwki" },
  "mwE85x": { name: "cid", value: "bafybeibhvbmdrz4jobbrmvz3lzolejnovyztgmyz7iiqdbmal23nj2ijqu?filename=projektmelody-chaturbate-20201221T210124Z-240p.mp4" },
  "bV7WjV": { name: "cid", value: "bafybeieq63nwsgpfhjaz7hk776nlggdn3ixh6di54o62xsoqq5dghh3vni?filename=projektmelody-chaturbate-20201224T230213Z-source.mp4" },
  "vXzNH2": { name: "cid", value: "bafybeihxhoxyrvtzglsgmluprj62sbzaxf3hbpy75cnbso5swtbpejeoma?filename=projektmelody-chaturbate-20201224T230213Z-240p.mp4" },
  "Re90HL": { name: "cid", value: "bafybeifldn5zk3zdlfrwz2fpkq7kph6igzjqriiabdrqybebpfkcv42a54" },
  "S7QOfI": { name: "cid", value: "bafybeicqbaepqyd7ui76i7mrzsc6no2e3yqyeomeejdeqi6y3yk6yt42yu?filename=projektmelody-chaturbate-20201228T232013Z-240p.mp4" },
  "_xoRfS": { name: "cid", value: "bafybeihsae6zqa3maljprazgb2xnyfmt2daodqctufjumk43n52err6wte" },
  "AhGo3W": { name: "cid", value: "bafybeifls3o67ig3rguxfxgoaojwigbjqoyvk3bm74gs2blrus4hdrj2ne?filename=projektmelody-chaturbate-20210103T230153Z-240p.mp4" },
  "BCDJNh": { name: "cid", value: "bafybeigcaxflf6ckpp5ibhp3nxeee4wcaxxypzfhngry5jpw67jgmw32nu" },
  "IPmy1l": { name: "cid", value: "bafybeicjwrnpzp2cdnqykqq3olglim7kbzccdnx576ohfgn5ieuuhqz3jy?filename=projektmelody-chaturbate-20210105T230736Z-240p.mp4" },
  "OA0C5v": { name: "cid", value: "bafybeidgud7sr7gx27thu7b5mxejvcjtao6dc7a6j6liz46xrg2ynv3lqe" },
  "Gi0q0w": { name: "cid", value: "bafybeibxbqhabhjuegappdgbm2tna6vfldsiqglzbleoy2etu5dz2fvpei?filename=projektmelody-chaturbate-20210108T230345Z-240p.mp4" },
  "_z30OW": { name: "cid", value: "bafybeia7jn6fhtphaag7dvq6emp7eq6pqpxjjrozybopdk2a4qxal7xv64" },
  "t1kSFP": { name: "cid", value: "bafybeifbcpdimiozo7oe367czyxenwlvakhpzdmoq2uhmiycq4qfu4omve?filename=projektmelody-chaturbate-20210110T195737Z-240p.mp4" },
  "LduOr2": { name: "cid", value: "bafybeihppdqlf7ttjmp5xwnxc5uyh5eb2rtjudlmny5msmspv4dbzpj3be" },
  "9syBEo": { name: "cid", value: "bafybeic2n45dew45othnlvdtcwvndbuy46zhmdj5tyghgaqf5zmi3q3ghu?filename=projektmelody-chaturbate-20210112T230322Z-240p.mp4" },
  "MNd0tk": { name: "cid", value: "bafybeiedq5tgjqqw2bx22cqlsomhvtq65uwhbbwl46wh3lbj4lyb563eja" },
  "DUzFlg": { name: "cid", value: "bafybeigrfa5hukry7rygducuerpovgurhdfoxad6s5u3obcq2c3ps5llzi?filename=projektmelody-chaturbate-20210116T010122Z-240p.mp4" },
  "zJkQsl": { name: "cid", value: "bafybeibymyi252us6gjwvl56rtw2vlt6up3c4im5erzwsmi4zo7bdf4lyq" },
  "7X5knr": { name: "cid", value: "bafybeibosawzum4sia2jqi7isfm2xqo32x6jugwvezeyomxmplez6xcdcy?filename=projektmelody-chaturbate-20210122T230224Z-240p.mp4" },
  "l4ra2T": { name: "cid", value: "bafybeidtqf4pv7ijwx3v7nm5thw4hh5lmxw6zfpo6tx4xb7uw44sehptd4" },
  "cjyLc8": { name: "cid", value: "bafybeidzq5vhzddabkofmwf5hh7dkyqxquxbkyceldlz2bbzus6htvugim?filename=projektmelody-chaturbate-20210126T230221Z-240p.mp4" },
  "lvsxPw": { name: "cid", value: "bafybeigm2vshlbnsaqo4f3doie2mn3bgprwcrdwhrmn52iphoecbckkltu" },
  "gbPN2E": { name: "cid", value: "bafybeieax6rugp3o2pgk2db6tm3wt4ulm4zrd5qg6qw3ejktufdqzszqym?filename=projektmelody-chaturbate-20210203T230044Z-240p.mp4" },
  "PPSq1b": { name: "cid", value: "bafybeihc6ytfvoujzzajhsz4xtixyknzcbn5kmzsytl7ferrm4p7wo4jhi" },
  "q_OJTz": { name: "cid", value: "bafybeidhwyjowp42z62ul6c5yrgfzmk4qzvt47jrefsj4fm5j5tru7ygp4?filename=projektmelody-chaturbate-20210205T225721Z-240p.mp4" },
  "6R1Amk": { name: "cid", value: "bafybeidblbgwk2pjvzxku63a23tv4rvrj76qxlwrmp3h4qpx5cuwjzbx64" },
  "Sna7kB": { name: "cid", value: "bafybeien6cdqc3kt46jxym4arvtkwnhidqwke4eg7djldp6r6kskknykey?filename=projektmelody-chaturbate-20210207T230403Z-240p.mp4" },
  "WyS5aS": { name: "cid", value: "bafybeid2fzpwnrqialm354ouxvuahs4yg7vnwgbbawkovv3ovrw24uah4q" },
  "DvCRk3": { name: "cid", value: "bafybeig4shxb35kzrjn2zciubtnlqrprhvvzbgissgyphhr5gj5lpbv24m?filename=projektmelody-chaturbate-20210210T232655Z-240p.mp4" },
  "dzXDUu": { name: "cid", value: "bafybeieb4dssva6ptl33hr24re2uyy7mf4qvp7idoaw5vwrnc4telxe3dq" },
  "bcyJ_5": { name: "cid", value: "bafybeiggsbgbqpa6irasfhnk57au2ejfw7sqvccymuyveffg4hdxqwyawy?filename=projektmelody-chaturbate-20210214T211333Z-240p.mp4" },
  "UgUAdt": { name: "cid", value: "bafybeicsnrgllmzwrkxp5w6wbwk2hiczexrla6aotgccsf43avle2mtnzq" },
  "3eODjm": { name: "cid", value: "bafybeiax7j2dvfy37ajfqw4knkakxm3ikhsbrvdldxxqo253sjoqvz42mi?filename=projektmelody-chaturbate-20210218T000118Z-240p.mp4" },
  "wTGCjC": { name: "cid", value: "bafybeifkwljrcmaw2cd6jbqqjsm2f4p4hazts6qb57l4wjsyzsohlcxwem" },
  "RXXf3R": { name: "cid", value: "bafybeieobezmn6sh5gb3vxmefwxvtnikqvfuibxkhbxjjredysqabyk7ey?filename=projektmelody-chaturbate-20210220T005931Z-240p.mp4" },
  "cw9j0-": { name: "cid", value: "bafybeibxbpsdglqxxwv6wjdrlut6pi6nppj7r6x66csoxtep4qssqn6wqu?filename=projektmelody-chaturbate-2021-02-24.mp4" },
  "r-Yt8y": { name: "cid", value: "bafybeidjg2zta75ulxwdzkdntxohyldhsaxbnhoyyxedw5tx54soc3ousa?filename=projektmelody-chaturbate-20210224T230100Z-240p.mp4" },
  "kkTcII": { name: "cid", value: "bafybeicxq4xjmika6iqjnu6ln3iehl2cgjhud7u2bzu7mgajyxrqgem5ri" },
  "DQRGjP": { name: "cid", value: "bafybeib47mmo2efo3gzligu2pc4qvlwzwmq4g3zfr7efdbp33qfbqzbjdu?filename=projektmelody-chaturbate-20210225T000000Z-240p.mp4" },
  "ov443S": { name: "cid", value: "bafybeiehczaajwv3cl7useh4n5tn77u5bnvi4b7s53flbbsyb4zfe7cgty" },
  "LPSGOq": { name: "cid", value: "bafybeibwnxsdcgofo7jehc765ugyplsgqwpeluqhf7cbfg7zyyucmgsdwy?filename=projektmelody-chaturbate-20210302T230727Z-240p.mp4" },
  "CRPf_x": { name: "cid", value: "bafybeieucdqbstfu2fyzedjwwrelmjudzz7uxabqrms6nv346zavn4tsfe" },
  "xq3X6w": { name: "cid", value: "bafybeigoz47uxvhiklihvgdt3atqieoadso4334f2vnuwmzemgdnpgepvq?filename=projektmelody-chaturbate-20210303T230348Z-240p.mp4" },
  "2Z1hyA": { name: "cid", value: "bafybeifq3sjvbxiudbh2dhjq5mrrs463lxfb73aptinlsa6glmbvnxwznm" },
  "rGjMqN": { name: "cid", value: "bafybeicddbsewm357shvllaudo4ezlpa4c3whvbqazrxdzuayq2jrkpdea?filename=projektmelody-chaturbate-20210312T225359Z-240p.mp4" },
  "ccgyWx": { name: "cid", value: "bafybeiddo5baz26gl52hnw2z35vvmk5lw5p7ax7xt5opek3z5hu4oa5hke" },
  "a3lm74": { name: "cid", value: "bafybeifk7ukapff2p24idm32tsrsmiadmxqhx576f3cm4xgimczsrpxona?filename=projektmelody-chaturbate-20210313T205844Z-240p.mp4" },
  "WccQxl": { name: "cid", value: "bafybeidtbda4x4ceof663iyzhzlecfbzxuvpvdzplfbuqah6sltefyrmmy?filename=projektmelody-chaturbate-20210320T000000Z.mp4" },
  "qC4CgG": { name: "cid", value: "bafybeiegcki6yswfmggi5qnag6b42fwdmp7njvzw7uedlv6ioeocd3tama?filename=projektmelody-chaturbate-20210320T000000Z-240p.mp4" },
  "h2cYLT": { name: "cid", value: "bafybeidbohxrp5435yjz4gpjhhxnpa5oeybzjvwmswx7yd2mcq2flo5xbu" },
  "_08vaP": { name: "cid", value: "bafybeicylj7ip2t25ogzsqem2577u4xu5amw3u6pufojkvrvzxfldfyk54?filename=projektmelody-chaturbate-20210322T220515Z-240p.mp4" },
  "y3zbY5": { name: "cid", value: "bafybeifdujfqp4ohbcvw7tyz6nhh5ih2vvf3xua2arz6nlpo2lixoj73sa" },
  "dvKdoS": { name: "cid", value: "bafybeidlqzjcwtf4kbt5dfqnzx7awmjaunicxeoy44d2c2bxlk6hnftw6i?filename=projektmelody-chaturbate-20210403T012621Z-240p.mp4" },
  "oMjHjX": { name: "cid", value: "bafybeihwffjcx327zxsnzzczl2rlhi34lhge4dij3bufax5qdi5afsrxl4?filename=projektmelody-chaturbate-20210403T195531Z-source.mp4" },
  "G8Sufp": { name: "cid", value: "bafybeiavche657wklwrop2chp7ilxpfevegbxou3rmg4lkamvqniyqxhza?filename=projektmelody-chaturbate-20210403T195531Z-240p.mp4" },
  "i1avFv": { name: "cid", value: "bafybeibexjman4wlgkggf7b6dzoghn5uarkzicgpzkdzspets5x4hwnwki" },
  "kVub-0": { name: "cid", value: "bafybeibgtx2glrvdbionxzenvlwtvqefj6hfpcnufabkqbk5mtgthuimcy?filename=projektmelody-chaturbate-20210412T231123Z-240p.mp4" },
  "3YuGo2": { name: "cid", value: "bafybeiavpnuswfrmck5htwat5fu6lqufbixluprntpuxnjbjkpu7f3oqqa" },
  "_CeeBW": { name: "cid", value: "bafybeiehp6wp6gulzaqauxo34eilgurlwdhdtbnbnjjlb3zigccxzitv7m?filename=projektmelody-chaturbate-20210418T003003Z-240p.mp4" },
  "xuBIQf": { name: "cid", value: "bafybeihu63ivnmzunfbcjahvn7qjbs7j2d5u7e56ujpkcd3ce6ypunhh3e" },
  "zafgVK": { name: "cid", value: "bafybeiess4qgqxrwsem7r6iedke5fkux7pb6flokiwem6p45kduuo6ofge?filename=projektmelody-chaturbate-20210423T230152Z-240p.mp4" },
  "mF0ZZR": { name: "cid", value: "bafybeie5ht3gffukelwq75u5lh547shl6jwtbagcukf7s354pyfbaknm4i?filename=projektmelody-chaturbate-20210424T000100Z-source.mp4" },
  "FPIJ9y": { name: "cid", value: "bafybeidzuvfdoymhhvbwrd3noxucf3tcw4glzxzrj2vishkgjfj3qomoge?filename=projektmelody-chaturbate-20210424T000100Z-240p.mp4" },
  "9JdcLp": { name: "cid", value: "bafybeid7edevrbukji6yorclaieqendfaikhowosp63wtt5aa3rt5zns2e" },
  "gI_o3V": { name: "cid", value: "bafybeif7ra2tfk4wmzbqll3xql4bmbm2oeu7xjnmwi5ai5wqohejhvwzii?filename=projektmelody-chaturbate-20210501T165901Z-240p.mp4" },
  "PbqIaD": { name: "cid", value: "bafybeiacdxziclwrdf4koabndex473vhchffrx4rorzmtu7vfwlquf7k5a" },
  "XZZm4Z": { name: "cid", value: "bafybeiaja2sjlqdmd3unuimcaqsjj2xy3e6srapk5k4is5tkrczssfuuim?filename=projektmelody-chaturbate-20210514T155336Z-240p.mp4" },
  "Lku51C": { name: "cid", value: "bafybeidsyqtr5etp4gm4jmlsxxmnkrqwu2mm3jfm3wp4ne6hkgxry4krxe" },
  "R6Tz_t": { name: "cid", value: "bafybeibnt4osiyrwsm6cnz4uhku3dg5kidkcydymnxhja2iusw4mufhqkm?filename=projektmelody-chaturbate-20210521T225903Z-240p.mp4" },
  "d73F-Y": { name: "cid", value: "bafybeiagwnwfa6tzrtyvppebvzo6two2g6656rbocpjfntnkib76m5ejju?filename=projektmelody-chaturbate-20210525T220421Z-source.mp4" },
  "64iWlA": { name: "cid", value: "bafybeihqmvfxuupauy2ans27rrh4jwcjlfchyohpolu7cw6jprargttrna?filename=projektmelody-chaturbate-20210525T220421Z-240p.mp4" },
  "ya74hn": { name: "cid", value: "bafybeihab6mp7r6fmx36tavycp5rltt3sswmvf5cjp7lirxcvlk4mqnzh4?filename=projektmelody-chaturbate-20210605T220200Z-source.mp4" },
  "QdKh7A": { name: "cid", value: "bafybeie4ozztxcyp323tzohuykanc3b77axv2kc7e3hduf7on6t6sp7hju?filename=projektmelody-chaturbate-20210605T220200Z-240p.mp4" },
  "4cKp8h": { name: "cid", value: "bafybeibgckbngpryekeddbjmrk5oe3l3hzafwpifgxmqwkn4ziewkcbow4?filename=projektmelody-chaturbate-20210606T220200Z-source.mp4" },
  "vhZxf4": { name: "cid", value: "bafybeidzg6qpqlvgiaafremr2gu56qt7mbtxvtlhgo3qyz6uipquw5z44i?filename=projektmelody-chaturbate-20210606T220200Z-240p.mp4" },
  "qgsBVU": { name: "cid", value: "bafybeidgcmxrxxlxzgdpoclfdkw4c7pybzchgbvvjjudbnn3svlimwbg7u?filename=projektmelody-chaturbate-20210612T225600Z-source.mp4" },
  "MAIURi": { name: "cid", value: "bafybeicjlknr45jfgf7gz6idcvk33gd7lnd4hud7y52vmy36dmmhiad6cq?filename=projektmelody-chaturbate-20210612T225600Z-240p.mp4" },
  "A_Nldn": { name: "cid", value: "bafybeie5fgnhoxu7ig3qq7e2ip6vxxls7gh3bqa3wyggnkt75xsuvr24ei?filename=projektmelody-chaturbate-20210615T225700Z.mp4" },
  "7ktciZ": { name: "cid", value: "bafybeieyjnamjx4dbggrkukxs65xf2hyv7fgmqn23at4rprg4xl56udwki?filename=projektmelody-chaturbate-20210615T225744Z-240p.mp4" },
  "7aImDw": { name: "cid", value: "bafybeiaywp4rg7u773ifbynnro6g3o34oe25fbzf73bh6bnhpgw4nkalgm?filename=projektmelody-chaturbate-20210626T200824Z-source.mp4" },
  "0RWctm": { name: "cid", value: "bafybeihyasv7xdghzwye2pq4b6qlzynf5tx456zxcnqge5jteflt5n2wwy?filename=projektmelody-chaturbate-20210626T200800Z-240p.mp4" },
  "Eum5ds": { name: "cid", value: "bafybeiecggca5yoz6vdh2icdbp5i5ypcmoxh7ayrbyj4cpimnzx3p4cghu?filename=projektmelody-chaturbate-20210703T220450Z-source.mp4" },
  "v0OIWR": { name: "cid", value: "bafybeihmdil3y6afdgotgrcscwukcswqxzj5qaxkjxa5aibfgflgs76u24?filename=projektmelody-chaturbate-20210703T220450Z-240p.mp4" },
  "JbOWhL": { name: "cid", value: "bafybeiasgffxi3znl235axtprwyhtbrjmgvq4lzvgmqxzyz36sbvoii2qq?filename=projektmelody-chaturbate-2021-07-04.mp4" },
  "78iekE": { name: "cid", value: "bafybeifbgw3zhdpiyoywtnbtoskw4vt2xwhlrwid4vuvolwb7azqpttfpm?filename=projektmelody-chaturbate-20210704T185039Z-240p.mp4" },
  "blT_Fq": { name: "cid", value: "bafybeib2mhzvta6auos6okiyvy5skcqs6lc7j2q44tdrx5hn5uxnnj735u?filename=projektmelody-chaturbate-2021-07-07.mp4" },
  "h37cUZ": { name: "cid", value: "bafybeicfemhdnhns5tculv4qigffiznuipe7zx7ampc7kldz5gntynfuqm?filename=projektmelody-chaturbate-20210707T190450Z-240p.mp4" },
  "JAIiBO": { name: "cid", value: "bafybeiajgb2ftzc65qkinszi2ydmrqm3vzjlbgmrm3cgjiaes7fx7jk2hy?filename=projektmelody_chaturbate_2021-07-13.mp4" },
  "2XceYx": { name: "cid", value: "bafybeig3whguj2ecdy2ajue3m2szokxbw5rtc3kbgkwb4rvjt67sc7owgi?filename=projektmelody-chaturbate-20210713T195208Z-240p.mp4" },
  "AI7eaU": { name: "cid", value: "bafybeigei5ehdgvj3ej2pchtm5dnffqqt3ir6clsrawxwlvh5ygccds4vm?filename=projektmelody-chaturbate-2021-07-17T20:05:10.000Z.mp4" },
  "5PsTHM": { name: "cid", value: "bafybeihekejklbjmynad5gdcagwevbka32hv74weekgghkpy5evtf3hrvq?filename=projektmelody-chaturbate-20210717T200510Z-240p.mp4" },
  "yopgWv": { name: "cid", value: "bafybeiao4lmyigdnfmmmvuzv32ougmc425qim2oihykbjxerz2k422z67y" },
  "-kU01-": { name: "cid", value: "bafybeifentypsylr7uyyprqvr3k3pvgkca35cfvizunpy37n4565q2k7w4?filename=projektmelody-chaturbate-20210727T230415Z-240p.mp4" },
  "5dgxf3": { name: "cid", value: "bafybeich6hucnqgbaragnyeftua3c2mjuf725upfl5zcii7gsgtcdesmyi" },
  "yrsWsV": { name: "cid", value: "bafybeihnii3kjfhhig6rzm2a6jf7giikajuqxkg5kanzy5t2ct5fduqv2e?filename=projektmelody-chaturbate-20210804T231138Z-240p.mp4" },
  "JNMgjz": { name: "cid", value: "bafybeie2pvgiwyemry4pkblxbeo5faingsatglgjkpsnu7rtl4v3ujn3h4?filename=projektmelody%25202021-08-08%252020_42-projektmelody.mp4" },
  "kMaV_b": { name: "cid", value: "bafybeifyhutqjx2te7epc7gsk6exz5buxqgm4xuw7w4lrrvwk7i6vqzbpy?filename=projektmelody-chaturbate-20210808T202641Z-240p.mp4" },
  "kBaQUG": { name: "cid", value: "bafybeibpbm4fo4mkmcwx3ow4ah6z63vuscfu5eigbdzeint7uvk4zojlpm?filename=projektmelody%25202021-08-12%252020_37-projektmelody.mp4" },
  "d2ZzUv": { name: "cid", value: "bafybeichhue2hpf725qqpbz67gxe4t2luwp667ozd4r7mjiy3vxctwng4m?filename=projektmelody-chaturbate-20210812T195720Z-240p.mp4" },
  "7lQP5m": { name: "cid", value: "bafybeihgzn66rgflw6nrog2lhvlzi744w4am3icyxkgkqfhdyh2yerot7y?filename=projektmelody2021-08-17.mp4" },
  "EdSGN5": { name: "cid", value: "bafybeigbvqq3wyyngnz5glv75pim3acwdwd7blbywklur4oiwfjx6vigti?filename=projektmelody-chaturbate-20210817T231650Z-240p.mp4" },
  "dNoRgt": { name: "cid", value: "bafybeicfxswewpi2zldeqarz5yhuwq33ormjxe2obx6ty4ckhypd776rga" },
  "z57rRm": { name: "cid", value: "bafybeiesejzpk4g2lmmczuoybhpw3knb737etvnwgbh35bus35psbu5pfa?filename=projektmelody-chaturbate-20210821T201336Z-240p.mp4" },
  "q_2qKt": { name: "cid", value: "bafybeicz7ns3l7mekjxe7vgbhsdysgdgvqb46kg33azeynyxtgwvi46v34?filename=projektmelody-chaturbate-20210830T230830Z-source.mp4" },
  "fEEh5x": { name: "cid", value: "bafybeihj75lmsugo6nffyarm2haz7wbi4tw7fz5jmetm2bh3pg76igmpwq?filename=projektmelody-chaturbate-20210830T230830Z-240p.mp4" },
  "7w5phG": { name: "cid", value: "bafybeidtrnshqfj7i3xxmxwvf4srp7xvwgchd2djctptgk3pbfwexq2o4y" },
  "MoQV0I": { name: "cid", value: "bafybeiepufhw57yq3ldgagpmephk2ik7a5shaiyzrk6q4k6ebitvyjn5lq?filename=projektmelody-chaturbate-20210903T215909Z-240p.mp4" },
  "eayHf3": { name: "cid", value: "bafybeiacbvfbxgo3e6aui6egsr5mq2azepss4ustgwuyogha246mlu5mjq" },
  "ZjtilR": { name: "cid", value: "bafybeihdzawpqnx32uunvejlajkyl7hx44zmk3lrsnp7rscbc5rhqcgzhq?filename=projektmelody-chaturbate-20210907T220124Z-240p.mp4" },
  "ODiojn": { name: "cid", value: "bafybeigy5vccyjsweg6mtluptpahkksybl2y3fg62eqiplwmmgwe65rdxi" },
  "O__JkL": { name: "cid", value: "bafybeic2fi3yxehpcbzfupoffmay5v7qpyndv24a6pzg6qkvgbq2zc4dqy?filename=projektmelody-chaturbate-20210909T230137Z-240p.mp4" },
  "tq4-OM": { name: "cid", value: "bafybeiabfjdg3llpjqpzqvtehsbbhhehwq7n6dwu54x2flfpylhv5iv6nm" },
  "vmBq-e": { name: "cid", value: "bafybeih6h4eqxvw2v5emp2rl46xnkdxsz2wkpru4zyafl5xoislo6i2ugy?filename=projektmelody-chaturbate-20210912T220347Z-240p.mp4" },
  "8sP1DD": { name: "cid", value: "bafybeiadu3pbfvwbioulutd37jpuft5ypnm5qovcswgffkkzkiw3qfpyoe" },
  "CzmMDl": { name: "cid", value: "bafybeifdpqzip5navntuhaveuvlngo4ylkkp4cbvntbzbnwhh5ctk5xjje?filename=projektmelody-chaturbate-20210916T200039Z-240p.mp4" },
  "4gbfWg": { name: "cid", value: "bafybeiggkrk5byiafxszqz3gzptpas3pud5szueurmg3jqumb2vgslr53e" },
  "-eM9tc": { name: "cid", value: "bafybeibqigct3go2bs4vzand4h7ilves5y3vkusj36hthwv4xtxxuawncy?filename=projektmelody-chaturbate-20210919T194734Z-240p.mp4" },
  "zhu46p": { name: "cid", value: "bafybeifpecuguv5ezgntfezzpu2s3vuj744puuuxfob467tob2w62qmntm" },
  "NKRMJE": { name: "cid", value: "bafybeifm6tkfacawn2ssj6wkinbm46m7s4aflqxmgvvurgptmut6tldvdq?filename=projektmelody-chaturbate-20210921T215601Z-240p.mp4" },
  "o7bUgI": { name: "cid", value: "bafybeicsvh64vpcvbx3pxwx3cao7dx5aj5hvczgfh6gctu2xcsx7penzgu" },
  "HTvWzs": { name: "cid", value: "bafybeiev7fiwpaas67tpobki3nei6kgrfhtj2qdyn7k4cxxl3zphk36fqi?filename=projektmelody-chaturbate-20210929T185541Z-240p.mp4" },
  "GoQi5S": { name: "cid", value: "bafybeidrgl27zzdj7aricbtxh6qraxaddvskqooywq5io4mpir4ljmztpq?filename=pmelody-2021-10-04.mp4" },
  "5829W2": { name: "cid", value: "bafybeic2yhco47orxdygo37zsfkgrwrsbqxaauqidiudsludz7lpp4xgqe?filename=projektmelody-chaturbate-20211004T222050Z-240p.mp4" },
  "_7prD1": { name: "cid", value: "bafybeidk7ltrlckcjjskgjxh2h7hynwxhdm2xw2jpk5cb6awhd37olu44q" },
  "STGaTL": { name: "cid", value: "bafybeiglye7okcmdywxen3kn23pf233bfdkft3ymzy2e47plswvdgxkhe4?filename=projektmelody-chaturbate-20211009T200955Z-240p.mp4" },
  "0-XvTE": { name: "cid", value: "bafybeidm2k2x5pz6623a3pltxzhjghxj57sxdqzbyjq37hpuwshwjlhnr4?filename=projektmelody-chaturbate-20211011T220620Z-source.mp4" },
  "v6YaUr": { name: "cid", value: "bafybeig6nddvx3lnkqvegmcfocxiyr7sh7fg4v6xfr5pbqvxcuhub3ifiq?filename=projektmelody-chaturbate-20211011T220620Z-240p.mp4" },
  "cKG51o": { name: "cid", value: "bafybeih6aohhgrjt2gljelc654wwa6uly5hsppxothhee5ttevtpywc654?filename=.%2fprojektmelody-chaturbate-2021-10-23T20%3a23%3a00.000Z.mp4" },
  "AHezpB": { name: "cid", value: "bafybeibbo3c3ms7jccui2nz727kkdau6c5flqnr3secmthj4oyyufpah4q?filename=projektmelody-chaturbate-20211023T211000Z-240p.mp4" },
  "_zk3cr": { name: "cid", value: "bafybeihrkmpibgetxr2w4ee26wzscwi4qrkpwmrdclthlxnnvuaudk3yki?filename=projektmelody-chaturbate-2021-11-04.mp4" },
  "v-uAT9": { name: "cid", value: "bafybeiflbj4y3a4u3oakpjmc7dzgivafvtj3wof5hehh4ogyy53tw7pdla?filename=projektmelody-chaturbate-20211104T220300Z-240p.mp4" },
  "1L4uHZ": { name: "cid", value: "bafybeiay5gbvtseoldxc4hduflzx2tjjqhcry3dyylxa7q47pbobkvu27a?filename=projektmelody-chaturbate-20211112T000700Z.mp4" },
  "ZSTg5R": { name: "cid", value: "bafybeifejdk3y7mtfoyyj2gohwds4tljenfgbe47mw5m6l65npebuaxszq?filename=projektmelody-chaturbate-20211112T000800Z-240p.mp4" },
  "Wxk_cQ": { name: "cid", value: "bafybeigv7wklmqunoe5da6wjbkpmzolliavu6flwj4ujs5x23tbmvd56ae?filename=projektmelody-chaturbate-20211116T230600Z-source.mp4" },
  "SyD9vB": { name: "cid", value: "bafybeihtasaggtdhjhyellghqteu6ezwqahq6fuukm4wbsbk5e2wgc2eta?filename=projektmelody-chaturbate-20211116T230600Z-240p.mp4" },
  "oJMxcH": { name: "cid", value: "bafybeiaqucacdfr7y3bofppw2dclnpt3qzzug4vppzaakso6abpouo72ai?filename=projektmelody-chaturbate-20211119T195900Z-source.mp4" },
  "LXHCwm": { name: "cid", value: "bafybeiealw4iu7flbu54gj4xr7kreowexgbkyeuoheunalm7asyv2gxfla?filename=projektmelody-chaturbate-20211119T195900Z-240p.mp4" },
  "Gr7_vd": { name: "cid", value: "bafybeidxsgv5qe7fwsfuybfixp432ifpiwssl36jwkkwigozpytnz4nbmy?filename=projektmelody-chaturbate-20211206T201000Z-source.mp4" },
  "d9klsx": { name: "cid", value: "bafybeiexawxjlzi3tkoqshvqqruhpvvsvs7nnlmww5cnckqqwk2t5hdsbm?filename=projektmelody-chaturbate-20211206T201000Z-240p.mp4" },
  "i47eAH": { name: "cid", value: "bafybeieisaplpdykjzah5g4gezizcjujovungma362n7z75y2jktrbk5pu?filename=projektmelody-chaturbate-20211212T231200Z-source.mp4" },
  "S7dpRc": { name: "cid", value: "bafybeihsogretdwkfvha3mz74ffcvdgeghig5f5lgq76cmdxzxscmzj76m?filename=projektmelody-chaturbate-20211212T231200Z-240p.mp4" },
  "veIwGe": { name: "cid", value: "bafybeif7ofnnqfwlr3fiomtb7fsn2stwxaufdmzma5tehs5osm42nu5654?filename=projektmelody-chaturbate-20211215T230400Z-source.mp4" },
  "uMoOhV": { name: "cid", value: "bafybeigc357uiow4vdt2cavigejtdh5wihmhqn7cmki6w4coikuxk5654a?filename=projektmelody-chaturbate-20211215T230400Z-240p.mp4" },
  "Jt-RKA": { name: "cid", value: "bafybeibheyhl37mdjbv3ygexgphcpcrhvtx3ahw6ulk7s3n7ld5ga4w7ga?filename=projektmelody-chaturbate-20211217T230500Z-source.mp4" },
  "cQ-kYg": { name: "cid", value: "bafybeibmy33c732elfnb4h652a2au27bcxg2pctghx43pgva4hf2wpqkqu?filename=projektmelody-chaturbate-20211217T230500Z-240p.mp4" },
  "u5fFpU": { name: "cid", value: "bafybeifzfamlwzgujz2qetuyg6wggq6fmsjrfsycsjgy6a7rudihocot4i?filename=projektmelody-chaturbate-20211222T235800Z-source.mp4" },
  "zzRzv1": { name: "cid", value: "bafybeid24c7sg2uvcicf5e5nsc7uppqdw3jnnlii35jr4ebgt5uy2lombq?filename=projektmelody-chaturbate-20211222T235800Z-240p.mp4" },
  "lecaGN": { name: "cid", value: "bafybeihpvf4mtxcz4usufix7slgd7cpsd4kxxu6uwlbddpndub6n3iywyq?filename=projektmelody-chaturbate-20211225T223400Z-source.mp4" },
  "UZzsDl": { name: "cid", value: "bafybeicv2dr6uxzehwn2kxqgp5ncljvzub66hdpw3ey6o7l7przvkq3shq?filename=projektmelody-chaturbate-20211225T223400Z-240p.mp4" },
  "n6Ew3h": { name: "cid", value: "bafybeiam646ep7wocx2m62pkexvhqhheuvl4ubqshlwiufpnb4qbkw5zbu?filename=projektmelody-chaturbate-20211225T223400Z-source.mp4" },
  "QIeUW1": { name: "cid", value: "bafybeihjgdyfexp64kcnrabantutgjrutaibdidvcahnmim2otra6vdvgu?filename=projektmelody-chaturbate-20211230T231745Z-240p.mp4" },
  "-zq86q": { name: "cid", value: "bafybeibvpqwrsvus7f6drtaf6stig7a3dchms7vh2dkhlz5lthasizwg5m?filename=projektmelody-chaturbate-2022-01-03.mp4" },
  "L2zFD-": { name: "cid", value: "bafybeidw4d3ff4qp3tilo3tn47tlybnsndfkxvmhmp5up7lhcjdeq3uytu?filename=projektmelody-chaturbate-20220103T231033Z-240p.mp4" },
  "XN0MbF": { name: "cid", value: "bafybeibdlg4rq3elsk4xtnolzowsnmcclxodnsysyflztxyab35uj2whga?filename=projektmelody-2022-01-09.mp4" },
  "0PLOI4": { name: "cid", value: "bafybeia5osq6tbca76ppsl7esqqrgqtkop3sxijewxryn6t3hy5up5pwee?filename=projektmelody-chaturbate-20220109T233249Z-240p.mp4" },
  "gSdKfv": { name: "cid", value: "bafybeiep7edxvyjswtsfaqos6jrsdq5dzrytji2y47kazwpz6myyznleae?filename=projektmelody-chaturbate-2022-01-13.mp4" },
  "xXDcLV": { name: "cid", value: "bafybeiej4jufs2ytrehbduw257yzf72js3xgvujadhw4bnx5spcxspwyui?filename=projektmelody-chaturbate-20220113T000600Z-240p.mp4" },
  "iHIa-e": { name: "cid", value: "bafybeidcjevhamw6wrdz6eb7dxgrg2ymyv3movyoncyd5wrhjdt2joi5qm?filename=projektmelody-chaturbate-20220115T205300Z-source.mp4" },
  "ELSdyX": { name: "cid", value: "bafybeicea54nznjuydpbtdfs3fhalml3hy6dsjjwmvh7ravgtedazvi7zq?filename=projektmelody-chaturbate-20220115T205300Z-240p.mp4" },
  "hS1PK0": { name: "cid", value: "bafybeifld37u4ujo4nvvfesqsjufqits63uuc5app6ieeqqmiiokzpxa24?filename=projektmelody-chaturbate-20220122T215900Z-source.mp4" },
  "FDbA5L": { name: "cid", value: "bafybeicrmef3jtobpln5iwky63ir3oktpl5ydwhocvztsqef6nuw75hrju?filename=projektmelody-chaturbate-20220122T215900Z-240p.mp4" },
  "zqXpT7": { name: "cid", value: "bafybeigppdhrhlucblzamkuucxyndnxbbxqvuv3lz3vaxwqjmj2i7jkeiu?filename=projektmelody-chaturbate-20220126T015725Z-source.mp4" },
  "e2Sdp2": { name: "cid", value: "bafybeia7yvhcpoql7hzonwtdrxml3jyr5ycn4f7ll3d3xrxqzl3hdeghmi?filename=projektmelody-chaturbate-20220126T015725Z-240p.mp4" },
  "jS1Tsm": { name: "cid", value: "bafybeieodfv7q32pcqtzfkidaixw7oegjlgwuxbz54aesxw67r6vdqmswy?filename=projektmelody-chaturbate-20220128T221321Z-source.mp4" },
  "0o4PjW": { name: "cid", value: "bafybeicchhwbrawc3a4dcf7e2emclzcxj4jzv4wiqakebp7tbddlyivctq?filename=projektmelody-chaturbate-20220128T221321Z-240p.mp4" },
  "ljxzf8": { name: "cid", value: "bafybeidpvjlo2jq4focrhp2u5kzgjibju2t2istourc3wki7ebamnlutuu?filename=projektmelody-chaturbate-20220202T214811Z-source.mp4" },
  "naHWXN": { name: "cid", value: "bafybeic7yvm3ojne7g25muttjwgoashgm272u4yiqokaaelvij3guw4c7e?filename=projektmelody-chaturbate-20220202T214811Z-240p.mp4" },
  "K2gCXp": { name: "cid", value: "bafybeihqbmc2xqiz523q5leroevwym2a4eglqqhztwlzg7pv7fadtxbycm?filename=projektmelody-chaturbate-20220207T232714Z-source.mp4" },
  "crcwj4": { name: "cid", value: "bafybeie2e45cci4ltjdtxvuqj424ylbdammr2jzwzviqgnncqdxdl67o3u?filename=projektmelody-chaturbate-20220207T232714Z-240p.mp4" },
  "hLbxX3": { name: "cid", value: "bafybeidxeg5jia44722ewvzw3estbe44twhad54vgsdjqldngum77gdjni?filename=projektmelody-chaturbate-20220213T211723Z-source.mp4" },
  "5108CV": { name: "cid", value: "bafybeib5wcl4udxaxoltizfsofsbrigqxhbdpfha7vpr64725t5wflc5vq?filename=projektmelody-chaturbate-20220213T211723Z-240p.mp4" },
  "q-SbhS": { name: "cid", value: "bafybeibcymhedd6zyaefh5bby6azqt4h7mtnoymspkwqxbc7p23qfwjahu?filename=projektmelody-chaturbate-20220216T230032Z-source.mp4" },
  "RkrXgB": { name: "cid", value: "bafybeibg6f3rb4v4b5lecddeghrceeo6cwcbojnglb4mdthibduzercpr4?filename=projektmelody-chaturbate-20220216T230032Z-240p.mp4" },
  "59b8u6": { name: "cid", value: "bafybeifnvdeucxpeocymmyludhv3xmrxvfzwmnlz5w7bq234gj74v25cea?filename=projektmelody-chaturbate-20220218T200116Z-source.mp4" },
  "G_sJn9": { name: "cid", value: "bafybeialggic6mvpby6g5yqef3pkiaofxys5cse22s6scfbtr2wavz3x54?filename=projektmelody-chaturbate-20220218T200116Z-240p.mp4" },
  "OsGVTJ": { name: "cid", value: "bafybeibvw7rwroyxgnkeyi6hkii3yrblqezua2r3oqtonjb5pwk7v4vkwu?filename=projektmelody-chaturbate-20220310T230220Z-source.mp4" },
  "fqF_dx": { name: "cid", value: "bafybeiao77nhn6lhkk3bvt4c2yxsar75qnxmm6fpms53vhcis5gd67xmni?filename=projektmelody-chaturbate-20220310T230220Z-240p.mp4" },
  "iJfAkR": { name: "cid", value: "bafybeihwch2toazyzjospgck72xv7b5dcevrn4jaoj32yufdu7nbtiyuaq?filename=projektmelody-chaturbate-20220318T013511Z-source.mp4" },
  "uwiDW1": { name: "cid", value: "bafybeiedfhitqxj4ancfowhgsseppfqf6v5tpa5u6tictyiy7qtjnpaele?filename=projektmelody-chaturbate-20220318T013511Z-240p.mp4" },
  "F0sm_C": { name: "cid", value: "bafybeicnsljyulw66qqrff6omzac7wha425i2okolymqelkpq7tbipy23y?filename=projektmelody-chaturbate-20220406T000200Z-source.mp4" },
  "jAiZNv": { name: "cid", value: "bafybeibe2uefrcfxst22jgw4hdrxam67pbywi7giwnkuvsqg7qz74kf6fy?filename=projektmelody-chaturbate-20220406T000200Z-240p.mp4" },
  "DOo2bh": { name: "cid", value: "bafybeidqcqsjpz5mmlvlplyz4rfd572gdtk3jhlgdmooqdhvf3owim42wu?filename=projektmelody-chaturbate-20220410T001241Z-source.mp4" },
  "GvFz5E": { name: "cid", value: "bafybeifeuovk7qdavz7h32tzrdpbl3bezimidrbm2nyi46fil35sh4a374?filename=projektmelody-chaturbate-20220410T001241Z-240p.mp4" },
  "3BpP1t": { name: "cid", value: "bafybeifjhkdkjpmtvwd6atpzqoulveqsodn65lrkwc6w66e4pcq4p7tw6i?filename=projektmelody-chaturbate-20220413T201050Z-source.mp4" },
  "GGpHqh": { name: "cid", value: "bafybeifcn5xogw557jknmdmu5yd5f66hwh3p3danwezrxckprguxhywy2i?filename=projektmelody-chaturbate-20220413T201050Z-240p.mp4" },
  "n1-G6Z": { name: "cid", value: "bafybeigecy6k32xsm3u37b6677zckduzmh2fq5q57gailm3ta5dodxoqla?filename=projektmelody-chaturbate-20220416T230942Z-source.mp4" },
  "CqZYCS": { name: "cid", value: "bafybeiewo2oczndjjk7hu22asnra7sha7s5ixwmjqzdjlu5xreua2pqn2y?filename=projektmelody-chaturbate-20220416T230942Z-240p.mp4" },
  "YK2dMt": { name: "cid", value: "bafybeicsliazvgkntmsffci5f5om4x45axvabkkydvyni5prpjhkqn5ik4?filename=projektmelody-chaturbate-20220422T231435Z-source.mp4" },
  "weR885": { name: "cid", value: "bafybeib7xyfshhb3hylm523ch5k4eriiho6htwhdxvnnbydfvzerxwpg3a?filename=projektmelody-chaturbate-20220422T231435Z-240p.mp4" },
  "9cXlK9": { name: "cid", value: "bafybeibwj7uqd24sxeedrodqbevodqld6jylc3rvgdxk6fdjfbzjpl7vqm?filename=projektmelody-chaturbate-20220506T225923Z-source.mp4" },
  "CVPPKW": { name: "cid", value: "bafybeihmbsuqkuhp4zhxf46kymqmakzlikpidj4in5rprljoqgafzchjii?filename=projektmelody-chaturbate-20220506T225923Z-240p.mp4" },
  "t3G3ZS": { name: "cid", value: "bafybeibpvqix7oyy77btrxrg7exacmwcxciigwpc3kolu7jiemlnx6rf2m?filename=projektmelody-chaturbate-20220508T225140Z-source.mp4" },
  "k9aN7D": { name: "cid", value: "bafybeih4hgis2dc34244izyrae5nkv6ihuheyeqaddpwikcap3wgvv56nq?filename=projektmelody-chaturbate-20220508T225140Z-240p.mp4" },
  "nIA0vy": { name: "cid", value: "bafybeig4hev3g35sbqiiluffeqhway7kmpmaprhtoh3iyepknfuhpbdenm?filename=projektmelody-chaturbate-20220513T191942Z-source.mp4" },
  "2qrhY2": { name: "cid", value: "bafybeicfq6xrdhvawuoclm3esmnbkhv3t7uadtct52xsownlshctbd3sie?filename=projektmelody-chaturbate-20220513T191942Z-240p.mp4" },
  "_iFvsj": { name: "cid", value: "bafybeichtqjz7dmszdbgswlt2lti52fuamhkmeensk3if27glrac2nxaia?filename=projektmelody-chaturbate-20220514T230218Z-source.mp4" },
  "8wW5KY": { name: "cid", value: "bafybeid6nzh3mifj5pyny4v5uu7c575eeqyl3gxbzhwkhr6krkfocdaegy?filename=projektmelody-chaturbate-20220514T230218Z-240p.mp4" },
  "KLtHAp": { name: "cid", value: "bafybeibsojoq3kiz6flb542lszshsmwzuuc2mxckymadpl5lwlrto5rehm?filename=projektmelody-chaturbate-20220519T004458Z-source.mp4" },
  "5DKgId": { name: "cid", value: "bafybeidtj57nyvaoy5y5b2vm6duck6jg5sc7zzdwt5rh4grxosqzfsnxsu?filename=projektmelody-chaturbate-20220519T004458Z-240p.mp4" },
  "YD2A4-": { name: "cid", value: "bafybeif2su72idmgqam3nbu5bqtagmpjr55mxp2ukivrpiav2rehfytxsm?filename=projektmelody-chaturbate-20220525T020607Z-source.mp4" },
  "5k2do0": { name: "cid", value: "bafybeihv23prb5gohtxzvf5zg3ayne6b6tifujiflnxbudztcxjdojsvhe?filename=projektmelody-chaturbate-20220525T020607Z-240p.mp4" },
  "1vjMMY": { name: "cid", value: "bafybeicbvbal57yzze5yhxcyp4pyvzwrwpz76vjia6hvvma43wof72rpky?filename=projektmelody-chaturbate-20220526T183128Z-source.mp4" },
  "b4HwnO": { name: "cid", value: "bafybeidj747ex4ylhzsd2zkn5vqhno2cnsflekqojxhvytlrkps6rt7mem?filename=projektmelody-chaturbate-20220526T183128Z-240p.mp4" },
  "8QTji7": { name: "cid", value: "bafybeiea7elzrcojpykmyktg4vdg4pislm2h6cxxgim6db3kbs3xxlaw4a?filename=projektmelody-chaturbate-20220605T233037Z-source.mp4" },
  "qKXuf7": { name: "cid", value: "bafybeie2fnz477ir3vvm6cefgh665r4sdza2ogg6eirdmi6n33yyz2mrzm?filename=projektmelody-chaturbate-20220605T233037Z-240p.mp4" },
  "HT4bHT": { name: "cid", value: "bafybeicd4uoiem2f6mavfqpcmgx55rp46ow4xtlwjz2cpjmi7anssk2ksy?filename=projektmelody-chaturbate-20220609T211003Z-source.mp4" },
  "ovuRxC": { name: "cid", value: "bafybeiaz33tzvelyo3j6yhmmheer47g5etpgs7yaed2euqe3nhisnz6ddy?filename=projektmelody-chaturbate-20220609T211003Z-240p.mp4" },
  "-96I-G": { name: "cid", value: "bafybeifjwqemzdmdda6qptqcvsugxaxpn4ay7mok6k7vnlco2jal454rru?filename=projektmelody-chaturbate-20220618T230700Z-source.mp4" },
  "dRQeoE": { name: "cid", value: "bafybeifb6p6weqydmbet2fcktnqyixecw5hnhr25tjjsdmo66p5p4iqii4?filename=projektmelody-chaturbate-20220618T230700Z-240p.mp4" },
  "Yg2AKQ": { name: "cid", value: "bafybeidjq3psgyaikki7ductfiukcxgqmkilds33xwnguu347ucpysoprq?filename=projektmelody-chaturbate-20220622T234631Z-source.mp4" },
  "meDL0v": { name: "cid", value: "bafybeidw3kmbpj2tzx3sgvc4z66zvzh7ts2z5ylb5jv4d6ns6773abdnle?filename=projektmelody-chaturbate-20220622T234631Z-240p.mp4" },
  "Ew-LeG": { name: "cid", value: "bafybeidkskxj7cycpfephuqsxtsgtbynitbyh6cgmy4zvwmm3cbf5wf3km?filename=projektmelody-chaturbate-20220719T034805Z-source.mp4" },
  "XjBm6f": { name: "cid", value: "bafybeianvrlzeodhgi2ooqwc3gxysbnzvij43cyafspupofmmcm4qy7xzu?filename=projektmelody-chaturbate-20220719T034805Z-240p.mp4" },
  "v_ZzCL": { name: "cid", value: "bafybeihauqdflvwynsijtk4evzpaudokxgviabrd3l2fycelltd3u434hm?filename=projektmelody-chaturbate-20220801T192831Z-source.mp4" },
  "rVuMz-": { name: "cid", value: "bafybeiacda3lrxnpf6ut6yuesoyzjld64yp2blers4kummc5g2xmws377e?filename=projektmelody-chaturbate-20220801T192831Z-240p.mp4" },
  "D6M9D-": { name: "cid", value: "bafybeig5ysad2uf7u3u6tzd27cw56a2mbpav2r4dkfubub7oatup7w436e?filename=projektmelody-chaturbate-20220803T233224Z-source.mp4" },
  "Sb9Zwi": { name: "cid", value: "bafybeif5wqrvmll67zicyn2s5nyhzrwtolktdf2deczmndv5n762mmrwte?filename=projektmelody-chaturbate-20220803T233224Z-240p.mp4" },
  "lq-vra": { name: "cid", value: "bafybeiccscmqr4lzb5whg5hjq6sj2uuhxyzrlxdyg3g3zb6hvrythawpea?filename=projektmelody-chaturbate-20220805T231533Z-source.mp4" },
  "FksqtN": { name: "cid", value: "bafybeigsz34vskkj4zndl56ufsdswkfghftjhwme7yaaepxr75zav3tomy?filename=projektmelody-chaturbate-20220805T231533Z-240p.mp4" },
  "hn0kGc": { name: "cid", value: "bafybeifwvpjoawsqt5kjhiyopa6clwv4jvp6g6jjtrxab3t54uaui2u32e?filename=projektmelody-chaturbate-20220811T203100Z-source.mp4" },
  "NzOIhS": { name: "cid", value: "bafybeiaho6ycrw4vcdqlijk3zqltdxxputaqasqumwfvy3kr7azygsaq2q?filename=projektmelody-chaturbate-20220811T203100Z-240p.mp4" },
  "YUwmUV": { name: "cid", value: "bafybeieuhyr5zmmtv5ofykxzbrg2wjoyl6mbrcwgaylg43jdiswt6tl73m?filename=projektmelody-chaturbate-20220823T232821Z-source.mp4" },
  "2Ay2tN": { name: "cid", value: "bafybeiaag527brovp33ha6qp4hhh2q44bfpdbvmyc4d26m2fw5gddsadgi?filename=projektmelody-chaturbate-20220823T232821Z-240p.mp4" },
  "JvyyQk": { name: "cid", value: "bafybeibn3vm7lo3b6qalm6wzrfd7t4bvuzzr4ylabvlpf4o4mwt7glsmm4?filename=projektmelody-chaturbate-20220902T200616Z-source.mp4" },
  "wyEbgL": { name: "cid", value: "bafybeibbp4ubdxe5sljfkg2v77tvyp7qadv2tjrz6mh6giazx7bkbvslxa?filename=projektmelody-chaturbate-20220902T200616Z-240p.mp4" },
  "Bw77MT": { name: "cid", value: "bafybeicxum5yocakavipt2zjda3cauk3pa3ibtbfnojj67nrkfexcdvagy?filename=2022-09-07.mp4" },
  "jLJ4yY": { name: "cid", value: "bafybeicg7abweov4y6fyuc6zmofa2m7jaweavvx3uo7yh5fmu4wm4nlibe?filename=projektmelody-chaturbate-20220907T231300Z-240p.mp4" },
  "_e4lhD": { name: "cid", value: "bafybeihgvv27a6oh5sxgbs27ojzxildwqfh5ultkmr6sfbdtddtsgtdypa?filename=projektmelody-chaturbate-2022-09-10.mp4" },
  "h93o-F": { name: "cid", value: "bafybeidrerlpuva46uubmheq55osstptjzunvceo66nlsqpv6r2nbzwk4q?filename=projektmelody-chaturbate-20220910T210336Z-240p.mp4" },
  "_nOPYi": { name: "cid", value: "bafybeiei47h2rg3ovvaaebfbmskzvqidm7eiwlist2f25jblkdrqg6pqla?filename=projektmelody-chaturbate-2022-09-13.mp4" },
  "UGMkyX": { name: "cid", value: "bafybeievhw4gvepq6z4oijzbtfcoo5nazh4k2oab7hq5g4oqrhgyzv27qe?filename=projektmelody-chaturbate-20220913T232631Z-240p.mp4" },
  "7nsbz5": { name: "cid", value: "bafybeifeig7lqkolh4ic6s2s34v63zwql3mg4c3kvw6qrxjk3tyrvwwnba?filename=projektmelody-chaturbate-20220921T233826Z-source.mp4" },
  "CtRSXu": { name: "cid", value: "bafybeiextaui3n4i7745afjzmcy6wedzfc3e5obxjkunjairr6cgp3jzf4?filename=projektmelody-chaturbate-20220921T233826Z-240p.mp4" },
  "kZwKaG": { name: "cid", value: "bafybeibepozbnnkxvuahsxfatdtzqje3dmqxweojywhzgvh3tvl3hk7cmu?filename=projektmelody-chaturbate-20220923T233818Z-source.mp4" },
  "35LWQL": { name: "cid", value: "bafybeigcn4ytwlfma4b7ewxwyli4xktre5rutojepxuoeoldfyif6xjdu4?filename=projektmelody-chaturbate-20220923T233818Z-240p.mp4" },
  "Ryxl3q": { name: "cid", value: "bafybeieexc2qpgtzou4nunxbrruz7awy4o6okexvftjphfzd6fpzlx77z4?filename=projektmelody-chaturbate-20221002T020522Z-source.mp4" },
  "-XBbJs": { name: "cid", value: "bafybeie3zpfskwia7rwh7ikful3qothc55wc3yubk2q4gdq742lgsmdu5q?filename=projektmelody-chaturbate-20221002T020522Z-240p.mp4" },
  "cEzKh0": { name: "cid", value: "bafybeibfcqrk4t44tj5p4wboj7dkn62cocgyyx3cvdx3jvhg72uedulpye?filename=projektmelody-chaturbate-20221004T231533Z-source.mp4" },
  "asdGdW": { name: "cid", value: "bafybeign7wv35a5onjqvat4elzyxq7vevql4unv2veajr33agmgp3kqlda?filename=projektmelody-chaturbate-20221004T231533Z-240p.mp4" },
  "4lhR98": { name: "cid", value: "bafybeig4gf23l6lxkau7zsseudbxy565mj4uj4o2iq6wiwrno4giplzb3a?filename=projektmelody-chaturbate-20221013T022245Z-source.mp4" },
  "ioy0Cd": { name: "cid", value: "bafybeibdnm4n5x3twnxcmgnoxjsxqvzidvfd6ithtgsm7koi7qsk4tgf6q?filename=projektmelody-chaturbate-20221013T022245Z-240p.mp4" },
  "aLHYcC": { name: "cid", value: "bafybeigpca24o23f62mxo5o72qbdew2aco32niky5q2guscrxlrf27mqma?filename=projektmelody-chaturbate-20221015T003127Z-source.mp4" },
  "cXS7z8": { name: "cid", value: "bafybeibawucjpvfgit3wcutoefgryl5ko5v6lhxcz2yr33bejhp7zdkx2e?filename=projektmelody-chaturbate-20221015T003127Z-240p.mp4" },
  "ytEiP6": { name: "cid", value: "bafybeibuvti3qi4lt2qkbzmxenvppcgjqlycxt4oiw27jhzttdtplne7t4?filename=projektmelody-chaturbate-20221020T232115Z-source.mp4" },
  "TFKHkE": { name: "cid", value: "bafybeihlmu5n6gcbxsnrlwpojwmxycircvq73xxsmbdkmx2lvksxunuvky?filename=projektmelody-chaturbate-20221020T232115Z-240p.mp4" },
  "ZpnldL": { name: "cid", value: "bafybeid3vam3o43zpmyq65tej2yejehtoxfya36q4sxv5giblsatwj2mcu?filename=projektmelody-chaturbate-20221027T232005Z.mp4" },
  "6gzJsq": { name: "cid", value: "bafybeifzbz6jxkh5dstij6glhxss4ooonz67pj6scjjlmv3jtyc5r2xy6m?filename=projektmelody-chaturbate-20221027T232005Z-240p.mp4" },
  "2dTCHf": { name: "cid", value: "bafybeigcpbisbyhk4lhsplui5xqpsbgpacycsobhm6zmvmw3ij36myuyxe?filename=projektmelody-chaturbate-20221104T202953Z-source.mp4" },
  "fXGY-m": { name: "cid", value: "bafybeicsjgpzgf5cm3zunejdrfmzktywlzcdrut3bfvkcry4vpr5hpzrje?filename=projektmelody-chaturbate-20221104T202953Z-240p.mp4" },
  "NMqrkB": { name: "cid", value: "bafybeig25winyjhorpz3btf7kroynl5yupegfzzazzecrigehfg45gpbfq?filename=projektmelody-chaturbate-20221112T001340Z-source.mp4" },
  "8T3bku": { name: "cid", value: "bafybeif6qkkixemw4racthup55xata574tzigubu2tamabbs24mhfgtjui?filename=projektmelody-chaturbate-20221112T001340Z-240p.mp4" },
  "8h_szY": { name: "cid", value: "bafybeigeendmcjezcqtbtaa2eqzfbnt433wjncnqkz4hjmgrqs4mgkbxua?filename=projektmelody-chaturbate-20221118T010345Z-source.mp4" },
  "qrhTPt": { name: "cid", value: "bafybeidchs2do3vyibagvzlnntokb5uscu756oar76yh2hcrzkgckno4wm?filename=projektmelody-chaturbate-20221118T010345Z-240p.mp4" },
  "WyUhXJ": { name: "cid", value: "bafybeifeno4xllalokcaktkpopchw62ycpssqqwxnxeuvveucnjobpzh2i?filename=projektmelody-chaturbate-20221119T223557Z-source.mp4" },
  "m3Mf17": { name: "cid", value: "bafybeifbk7gbv2qwxo4r42tczcah4fnzbzsz57352mtayzw7dw42weutfq?filename=projektmelody-chaturbate-20221119T223557Z-240p.mp4" },
  "0e9t97": { name: "cid", value: "bafybeiet5kgzmdlcjheexilp7t2v7mwa54v4o2sdmfktseymnuvowiycf4?filename=/root/projektmelody-chaturbate-2022-11-22.mp4" },
  "U_ILnW": { name: "cid", value: "bafybeifbrz3km3yehhxz5adi4e3rf5fejh3jyojtpflchakedg26g47nti?filename=projektmelody-chaturbate-20221122T011555Z-240p.mp4" },
  "nYmQJC": { name: "cid", value: "bafybeie3c3s6rdmgxf3eatdxgcl6sv7xpd62fmyrg5qtkswbhu5gltmtjy?filename=projektmelody-chaturbate-20221122T230443Z-source.mp4" },
  "x3NSvo": { name: "cid", value: "bafybeig6brczuhl2utza7e4gsiufjzesnmbsn4nnrzr5bqoxtoaxkpvjjq?filename=projektmelody-chaturbate-20221122T230443Z-240p.mp4" },
  "iJyqak": { name: "cid", value: "bafybeidqeepfyf7tvzzfkbwqsmtfibfershvbkfnkkcxgnbe376qovazcy?filename=projektmelody-chaturbate-20221214T000145Z-source.mp4" },
  "6XbXk7": { name: "cid", value: "bafybeigdbmgy2ucjq7x3wm37zywkmour5r5hrjgvwje7vqixhcfuakxlrq?filename=projektmelody-chaturbate-20221214T000145Z-240p.mp4" },
  "npyiuf": { name: "cid", value: "bafybeicsjevndzuummsd7mdrs6fpfdougcd6bc6ph7c72m5p2ju6u7pzgu?filename=projektmelody-chaturbate-20221216T003034Z-source.mp4" },
  "Vihq8J": { name: "cid", value: null },
  "cGU8-1": { name: "cid", value: "bafybeiefxe2loh7k35tu2ekimlnlgncozdqpgle7vdveujtbbkrfdvm67u?filename=projektmelody-chaturbate-20221217T221420Z-source.mp4" },
  "wViQ6y": { name: "cid", value: "bafybeigqelskmqaib2v4dxaxgbv2tf63q6rfqshp7jpr4mt4jndaza3jhm?filename=projektmelody-chaturbate-20221217T221420Z-240p.mp4" },
  "KjnoR_": { name: "cid", value: "bafybeie3oynhomwdwvkdwgef2viii7kccpegnk6zvfprl4fyz6p52qwh6u?filename=projektmelody-chaturbate-20230101T220349Z-source.mp4" },
  "csldSS": { name: "cid", value: "bafybeigxgp3slhb63u2pegkwinrfzsmzf5orsrjikvoylygd6nrvbmghou?filename=projektmelody-chaturbate-20230101T220349Z-240p.mp4" },
  "I8lqdl": { name: "cid", value: "bafybeifp3xg2qj4tj2hdmna5woxglaup64kyvish4equ5dfq6ggj6n2vry?filename=projektmelody-chaturbate-20230105T020718Z-source.mp4" },
  "H5vDFz": { name: "cid", value: "bafybeie6fzzwvuxjlzb2nzagyqwf4xwydsfgkdstays36x2as3nwesggm4?filename=projektmelody-chaturbate-20230105T020718Z-240p.mp4" },
  "UkajPi": { name: "cid", value: "bafybeiagi57772sulgsl2j5zwgvp4yitn25msmqfhjpmpy26krifocwdbi?filename=projektmelody-chaturbate-20230105T205829Z-source.mp4" },
  "c8r9YR": { name: "cid", value: "bafybeiaumniuwtjwj7slb2ry5ypcg426nf3a2xld5or3s6vlaf4kv7tsva?filename=projektmelody-chaturbate-20230105T205829Z-240p.mp4" },
  "fMWo8-": { name: "cid", value: "bafybeibmpishntx3kv6lckeewixuvrghzclmn47b4723akalhdpjmblhaa?filename=projektmelody-chaturbate-20230109T230718Z-source.mp4" },
  "ANP9c6": { name: "cid", value: "bafybeighkhqu444d7mnopwfailiktywqvuvuj4535pddo6n4qbmxjmxrgy?filename=projektmelody-chaturbate-20230109T230718Z-240p.mp4" },
  "9pc71Q": { name: "cid", value: "bafybeigtamchlaazrba3ybl6wermbz5jgyhb5jqzqmngbwq32rpzl45g74?filename=projektmelody-chaturbate-20230113T182113Z-source.mp4" },
  "s8ka6h": { name: "cid", value: "bafybeics2chge2fwhdodyfuo5w4ks32k4pzrcz56yadfli7cugbvsxqnk4?filename=projektmelody-chaturbate-20230113T182113Z-240p.mp4" },
  "tn9bBF": { name: "cid", value: "bafybeia4257pwml2hnan2mwhunaluu2o2ufxfi647bjkj5ed5tigbxfcbm?filename=projektmelody-chaturbate-20230120T003706Z-source.mp4" },
  "b8Lmi1": { name: "cid", value: "bafybeicmfair7avqyv7k47gpkvbtwzotldhg3uxcu7jbwglgsi5cduxz7m?filename=projektmelody-chaturbate-20230120T003706Z-240p.mp4" },
  "ivw6UI": { name: "cid", value: "bafybeies6feikx5fnqoyvgukznvjqgjsfsmv4z33svgmqcbftombg45sq4" },
  "rRtEv0": { name: "cid", value: null },
  "qbH-Bz": { name: "cid", value: "bafybeiekafws2a6r5ojiybhv5r7dmkhmyuk4ukkcfrzq4uysoduxmj3sze?filename=projektmelody-chaturbate-20230125T001939Z-source.mp4" },
  "sm_eoo": { name: "cid", value: "bafybeidmdbsumnraqtsdmjal2qndp4pwn2axbg7t5eslolbfdgir3sqcxi?filename=projektmelody-chaturbate-20230125T001939Z-240p.mp4" },
  "6xrCyN": { name: "cid", value: "bafybeifgpfviyxjegacv5nwifojuis6molzvcnlulh6g3vx7l6f6kmx4ae?filename=projektmelody-chaturbate-20230129T220621Z-source.mp4" },
  "AxqkVB": { name: "cid", value: "bafybeihbrk23djd4cblto4jstztevcttibm3me5a6izy263c4mgbs5mtsa?filename=projektmelody-chaturbate-20230129_240p.mp4" },
  "2ukBbo": { name: "cid", value: "bafybeictm56hmmahur4wr7yd26ggxapaluabjkz3bafvzo4v5mieba6ohq" },
  "n3054t": { name: "cid", value: "bafybeih2ypi5sumfajunoyranhipkdty2a42gpmmdwottnkcby23kob5we" },
  "9uq3Dv": { name: "cid", value: "bafybeiakbwzng43epwulnmkyorvuvg6ehjndfsdyw7gsiinfnfula2uz2e" },
  "UVMRH7": { name: "cid", value: "bafybeigvuu4qszkbkijluvxfqv772jcnle6xgnkc7v25kcmci5l2a65n3i" },
  "kHyGbv": { name: "cid", value: "bafybeihmnn2apsril7cpv3wj4htsrkdvgugmnurun7mbm5yn7c4mh4qrhy" },
  "mT3VoF": { name: "cid", value: "bafybeihs43cqo7mjkv46semiinz644qzkvh3mdia7elrthjhpqtfymlk4q" },
  "Yh3ss_": { name: "cid", value: "bafybeid4sl3nsiste4fp2zxx5gzhywwb2aswnamop2sp3bmg5s6dgtieti" },
  "0EO2GG": { name: "cid", value: "bafybeihklidyfxe3buqsnvh6fs7fr7b2k2btieqfs5e2y6ct3pjkoo7oam" },
  "0RJywY": { name: "cid", value: "bafybeiadv3vym2rnxkhf66ygs5fr32gknhue4tyeyu5gfrbw6czpurzi4i" },
  "q2sfzl": { name: "cid", value: "bafybeibsoeo6q5l52pgxqdnapxaoxme4rzl5japngwr7oyi2rocphbxd44" },
  "tT9W8I": { name: "cid", value: "bafybeigiunmaetg3tjjgaepz5azb6lcpp2pzoiwdf52o4ux4gu3jpcr42i" },
  "YvNlNh": { name: "cid", value: "bafybeifymz27r5uyu5zccngsa34g75lgy3cupqsq7qpiujz5pyjbkul7ti" },
  "XhVp8r": { name: "cid", value: "bafybeidexzucuf56rr7nxbfv4xi5zbtk6u5fqps64tg7l4p7fxlmay3gdy" },
  "Sm1TQN": { name: "cid", value: "bafybeiclju6m3jwyv6uac4hhwtnfxj4lbdn5wf5pv2mvkwoy4nan7vqz2u" }
};
function _defineProperty$1(e, t, i) {
  return t in e ? Object.defineProperty(e, t, { value: i, enumerable: true, configurable: true, writable: true }) : e[t] = i, e;
}
function _classCallCheck(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, t) {
  for (var i = 0; i < t.length; i++) {
    var s = t[i];
    s.enumerable = s.enumerable || false, s.configurable = true, "value" in s && (s.writable = true), Object.defineProperty(e, s.key, s);
  }
}
function _createClass(e, t, i) {
  return t && _defineProperties(e.prototype, t), i && _defineProperties(e, i), e;
}
function _defineProperty(e, t, i) {
  return t in e ? Object.defineProperty(e, t, { value: i, enumerable: true, configurable: true, writable: true }) : e[t] = i, e;
}
function ownKeys(e, t) {
  var i = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    t && (s = s.filter(function(t2) {
      return Object.getOwnPropertyDescriptor(e, t2).enumerable;
    })), i.push.apply(i, s);
  }
  return i;
}
function _objectSpread2(e) {
  for (var t = 1; t < arguments.length; t++) {
    var i = null != arguments[t] ? arguments[t] : {};
    t % 2 ? ownKeys(Object(i), true).forEach(function(t2) {
      _defineProperty(e, t2, i[t2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : ownKeys(Object(i)).forEach(function(t2) {
      Object.defineProperty(e, t2, Object.getOwnPropertyDescriptor(i, t2));
    });
  }
  return e;
}
var defaults$1 = { addCSS: true, thumbWidth: 15, watch: true };
function matches$1(e, t) {
  return function() {
    return Array.from(document.querySelectorAll(t)).includes(this);
  }.call(e, t);
}
function trigger(e, t) {
  if (e && t) {
    var i = new Event(t, { bubbles: true });
    e.dispatchEvent(i);
  }
}
var getConstructor$1 = function(e) {
  return null != e ? e.constructor : null;
}, instanceOf$1 = function(e, t) {
  return !!(e && t && e instanceof t);
}, isNullOrUndefined$1 = function(e) {
  return null == e;
}, isObject$1 = function(e) {
  return getConstructor$1(e) === Object;
}, isNumber$1 = function(e) {
  return getConstructor$1(e) === Number && !Number.isNaN(e);
}, isString$1 = function(e) {
  return getConstructor$1(e) === String;
}, isBoolean$1 = function(e) {
  return getConstructor$1(e) === Boolean;
}, isFunction$1 = function(e) {
  return getConstructor$1(e) === Function;
}, isArray$1 = function(e) {
  return Array.isArray(e);
}, isNodeList$1 = function(e) {
  return instanceOf$1(e, NodeList);
}, isElement$1 = function(e) {
  return instanceOf$1(e, Element);
}, isEvent$1 = function(e) {
  return instanceOf$1(e, Event);
}, isEmpty$1 = function(e) {
  return isNullOrUndefined$1(e) || (isString$1(e) || isArray$1(e) || isNodeList$1(e)) && !e.length || isObject$1(e) && !Object.keys(e).length;
}, is$1 = { nullOrUndefined: isNullOrUndefined$1, object: isObject$1, number: isNumber$1, string: isString$1, boolean: isBoolean$1, function: isFunction$1, array: isArray$1, nodeList: isNodeList$1, element: isElement$1, event: isEvent$1, empty: isEmpty$1 };
function getDecimalPlaces(e) {
  var t = "".concat(e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  return t ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0)) : 0;
}
function round(e, t) {
  if (1 > t) {
    var i = getDecimalPlaces(t);
    return parseFloat(e.toFixed(i));
  }
  return Math.round(e / t) * t;
}
var RangeTouch = function() {
  function e(t, i) {
    _classCallCheck(this, e), is$1.element(t) ? this.element = t : is$1.string(t) && (this.element = document.querySelector(t)), is$1.element(this.element) && is$1.empty(this.element.rangeTouch) && (this.config = _objectSpread2({}, defaults$1, {}, i), this.init());
  }
  return _createClass(e, [{ key: "init", value: function() {
    e.enabled && (this.config.addCSS && (this.element.style.userSelect = "none", this.element.style.webKitUserSelect = "none", this.element.style.touchAction = "manipulation"), this.listeners(true), this.element.rangeTouch = this);
  } }, { key: "destroy", value: function() {
    e.enabled && (this.config.addCSS && (this.element.style.userSelect = "", this.element.style.webKitUserSelect = "", this.element.style.touchAction = ""), this.listeners(false), this.element.rangeTouch = null);
  } }, { key: "listeners", value: function(e2) {
    var t = this, i = e2 ? "addEventListener" : "removeEventListener";
    ["touchstart", "touchmove", "touchend"].forEach(function(e3) {
      t.element[i](e3, function(e4) {
        return t.set(e4);
      }, false);
    });
  } }, { key: "get", value: function(t) {
    if (!e.enabled || !is$1.event(t))
      return null;
    var i, s = t.target, n = t.changedTouches[0], r = parseFloat(s.getAttribute("min")) || 0, a = parseFloat(s.getAttribute("max")) || 100, o = parseFloat(s.getAttribute("step")) || 1, l = s.getBoundingClientRect(), c = 100 / l.width * (this.config.thumbWidth / 2) / 100;
    return 0 > (i = 100 / l.width * (n.clientX - l.left)) ? i = 0 : 100 < i && (i = 100), 50 > i ? i -= (100 - 2 * i) * c : 50 < i && (i += 2 * (i - 50) * c), r + round(i / 100 * (a - r), o);
  } }, { key: "set", value: function(t) {
    e.enabled && is$1.event(t) && !t.target.disabled && (t.preventDefault(), t.target.value = this.get(t), trigger(t.target, "touchend" === t.type ? "change" : "input"));
  } }], [{ key: "setup", value: function(t) {
    var i = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, s = null;
    if (is$1.empty(t) || is$1.string(t) ? s = Array.from(document.querySelectorAll(is$1.string(t) ? t : 'input[type="range"]')) : is$1.element(t) ? s = [t] : is$1.nodeList(t) ? s = Array.from(t) : is$1.array(t) && (s = t.filter(is$1.element)), is$1.empty(s))
      return null;
    var n = _objectSpread2({}, defaults$1, {}, i);
    if (is$1.string(t) && n.watch) {
      var r = new MutationObserver(function(i2) {
        Array.from(i2).forEach(function(i3) {
          Array.from(i3.addedNodes).forEach(function(i4) {
            is$1.element(i4) && matches$1(i4, t) && new e(i4, n);
          });
        });
      });
      r.observe(document.body, { childList: true, subtree: true });
    }
    return s.map(function(t2) {
      return new e(t2, i);
    });
  } }, { key: "enabled", get: function() {
    return "ontouchstart" in document.documentElement;
  } }]), e;
}();
const getConstructor = (e) => null != e ? e.constructor : null, instanceOf = (e, t) => Boolean(e && t && e instanceof t), isNullOrUndefined = (e) => null == e, isObject = (e) => getConstructor(e) === Object, isNumber = (e) => getConstructor(e) === Number && !Number.isNaN(e), isString = (e) => getConstructor(e) === String, isBoolean = (e) => getConstructor(e) === Boolean, isFunction = (e) => "function" == typeof e, isArray = (e) => Array.isArray(e), isWeakMap = (e) => instanceOf(e, WeakMap), isNodeList = (e) => instanceOf(e, NodeList), isTextNode = (e) => getConstructor(e) === Text, isEvent = (e) => instanceOf(e, Event), isKeyboardEvent = (e) => instanceOf(e, KeyboardEvent), isCue = (e) => instanceOf(e, window.TextTrackCue) || instanceOf(e, window.VTTCue), isTrack = (e) => instanceOf(e, TextTrack) || !isNullOrUndefined(e) && isString(e.kind), isPromise = (e) => instanceOf(e, Promise) && isFunction(e.then), isElement = (e) => null !== e && "object" == typeof e && 1 === e.nodeType && "object" == typeof e.style && "object" == typeof e.ownerDocument, isEmpty = (e) => isNullOrUndefined(e) || (isString(e) || isArray(e) || isNodeList(e)) && !e.length || isObject(e) && !Object.keys(e).length, isUrl = (e) => {
  if (instanceOf(e, window.URL))
    return true;
  if (!isString(e))
    return false;
  let t = e;
  e.startsWith("http://") && e.startsWith("https://") || (t = `http://${e}`);
  try {
    return !isEmpty(new URL(t).hostname);
  } catch (e2) {
    return false;
  }
};
var is = { nullOrUndefined: isNullOrUndefined, object: isObject, number: isNumber, string: isString, boolean: isBoolean, function: isFunction, array: isArray, weakMap: isWeakMap, nodeList: isNodeList, element: isElement, textNode: isTextNode, event: isEvent, keyboardEvent: isKeyboardEvent, cue: isCue, track: isTrack, promise: isPromise, url: isUrl, empty: isEmpty };
const transitionEndEvent = (() => {
  const e = document.createElement("span"), t = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" }, i = Object.keys(t).find((t2) => void 0 !== e.style[t2]);
  return !!is.string(i) && t[i];
})();
function repaint(e, t) {
  setTimeout(() => {
    try {
      e.hidden = true, e.offsetHeight, e.hidden = false;
    } catch (e2) {
    }
  }, t);
}
const browser = { isIE: Boolean(window.document.documentMode), isEdge: /Edge/g.test(navigator.userAgent), isWebkit: "WebkitAppearance" in document.documentElement.style && !/Edge/g.test(navigator.userAgent), isIPhone: /iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1, isIos: /iPad|iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1 };
function cloneDeep(e) {
  return JSON.parse(JSON.stringify(e));
}
function getDeep(e, t) {
  return t.split(".").reduce((e2, t2) => e2 && e2[t2], e);
}
function extend(e = {}, ...t) {
  if (!t.length)
    return e;
  const i = t.shift();
  return is.object(i) ? (Object.keys(i).forEach((t2) => {
    is.object(i[t2]) ? (Object.keys(e).includes(t2) || Object.assign(e, { [t2]: {} }), extend(e[t2], i[t2])) : Object.assign(e, { [t2]: i[t2] });
  }), extend(e, ...t)) : e;
}
function wrap(e, t) {
  const i = e.length ? e : [e];
  Array.from(i).reverse().forEach((e2, i2) => {
    const s = i2 > 0 ? t.cloneNode(true) : t, n = e2.parentNode, r = e2.nextSibling;
    s.appendChild(e2), r ? n.insertBefore(s, r) : n.appendChild(s);
  });
}
function setAttributes(e, t) {
  is.element(e) && !is.empty(t) && Object.entries(t).filter(([, e2]) => !is.nullOrUndefined(e2)).forEach(([t2, i]) => e.setAttribute(t2, i));
}
function createElement(e, t, i) {
  const s = document.createElement(e);
  return is.object(t) && setAttributes(s, t), is.string(i) && (s.innerText = i), s;
}
function insertAfter(e, t) {
  is.element(e) && is.element(t) && t.parentNode.insertBefore(e, t.nextSibling);
}
function insertElement(e, t, i, s) {
  is.element(t) && t.appendChild(createElement(e, i, s));
}
function removeElement(e) {
  is.nodeList(e) || is.array(e) ? Array.from(e).forEach(removeElement) : is.element(e) && is.element(e.parentNode) && e.parentNode.removeChild(e);
}
function emptyElement(e) {
  if (!is.element(e))
    return;
  let { length: t } = e.childNodes;
  for (; t > 0; )
    e.removeChild(e.lastChild), t -= 1;
}
function replaceElement(e, t) {
  return is.element(t) && is.element(t.parentNode) && is.element(e) ? (t.parentNode.replaceChild(e, t), e) : null;
}
function getAttributesFromSelector(e, t) {
  if (!is.string(e) || is.empty(e))
    return {};
  const i = {}, s = extend({}, t);
  return e.split(",").forEach((e2) => {
    const t2 = e2.trim(), n = t2.replace(".", ""), r = t2.replace(/[[\]]/g, "").split("="), [a] = r, o = r.length > 1 ? r[1].replace(/["']/g, "") : "";
    switch (t2.charAt(0)) {
      case ".":
        is.string(s.class) ? i.class = `${s.class} ${n}` : i.class = n;
        break;
      case "#":
        i.id = t2.replace("#", "");
        break;
      case "[":
        i[a] = o;
    }
  }), extend(s, i);
}
function toggleHidden(e, t) {
  if (!is.element(e))
    return;
  let i = t;
  is.boolean(i) || (i = !e.hidden), e.hidden = i;
}
function toggleClass(e, t, i) {
  if (is.nodeList(e))
    return Array.from(e).map((e2) => toggleClass(e2, t, i));
  if (is.element(e)) {
    let s = "toggle";
    return void 0 !== i && (s = i ? "add" : "remove"), e.classList[s](t), e.classList.contains(t);
  }
  return false;
}
function hasClass(e, t) {
  return is.element(e) && e.classList.contains(t);
}
function matches(e, t) {
  const { prototype: i } = Element;
  return (i.matches || i.webkitMatchesSelector || i.mozMatchesSelector || i.msMatchesSelector || function() {
    return Array.from(document.querySelectorAll(t)).includes(this);
  }).call(e, t);
}
function closest$1(e, t) {
  const { prototype: i } = Element;
  return (i.closest || function() {
    let e2 = this;
    do {
      if (matches.matches(e2, t))
        return e2;
      e2 = e2.parentElement || e2.parentNode;
    } while (null !== e2 && 1 === e2.nodeType);
    return null;
  }).call(e, t);
}
function getElements(e) {
  return this.elements.container.querySelectorAll(e);
}
function getElement(e) {
  return this.elements.container.querySelector(e);
}
function setFocus(e = null, t = false) {
  is.element(e) && (e.focus({ preventScroll: true }), t && toggleClass(e, this.config.classNames.tabFocus));
}
const defaultCodecs = { "audio/ogg": "vorbis", "audio/wav": "1", "video/webm": "vp8, vorbis", "video/mp4": "avc1.42E01E, mp4a.40.2", "video/ogg": "theora" }, support = { audio: "canPlayType" in document.createElement("audio"), video: "canPlayType" in document.createElement("video"), check(e, t, i) {
  const s = browser.isIPhone && i && support.playsinline, n = support[e] || "html5" !== t;
  return { api: n, ui: n && support.rangeInput && ("video" !== e || !browser.isIPhone || s) };
}, pip: !(browser.isIPhone || !is.function(createElement("video").webkitSetPresentationMode) && (!document.pictureInPictureEnabled || createElement("video").disablePictureInPicture)), airplay: is.function(window.WebKitPlaybackTargetAvailabilityEvent), playsinline: "playsInline" in document.createElement("video"), mime(e) {
  if (is.empty(e))
    return false;
  const [t] = e.split("/");
  let i = e;
  if (!this.isHTML5 || t !== this.type)
    return false;
  Object.keys(defaultCodecs).includes(i) && (i += `; codecs="${defaultCodecs[e]}"`);
  try {
    return Boolean(i && this.media.canPlayType(i).replace(/no/, ""));
  } catch (e2) {
    return false;
  }
}, textTracks: "textTracks" in document.createElement("video"), rangeInput: (() => {
  const e = document.createElement("input");
  return e.type = "range", "range" === e.type;
})(), touch: "ontouchstart" in document.documentElement, transitions: false !== transitionEndEvent, reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches }, supportsPassiveListeners = (() => {
  let e = false;
  try {
    const t = Object.defineProperty({}, "passive", { get: () => (e = true, null) });
    window.addEventListener("test", null, t), window.removeEventListener("test", null, t);
  } catch (e2) {
  }
  return e;
})();
function toggleListener(e, t, i, s = false, n = true, r = false) {
  if (!e || !("addEventListener" in e) || is.empty(t) || !is.function(i))
    return;
  const a = t.split(" ");
  let o = r;
  supportsPassiveListeners && (o = { passive: n, capture: r }), a.forEach((t2) => {
    this && this.eventListeners && s && this.eventListeners.push({ element: e, type: t2, callback: i, options: o }), e[s ? "addEventListener" : "removeEventListener"](t2, i, o);
  });
}
function on(e, t = "", i, s = true, n = false) {
  toggleListener.call(this, e, t, i, true, s, n);
}
function off(e, t = "", i, s = true, n = false) {
  toggleListener.call(this, e, t, i, false, s, n);
}
function once(e, t = "", i, s = true, n = false) {
  const r = (...a) => {
    off(e, t, r, s, n), i.apply(this, a);
  };
  toggleListener.call(this, e, t, r, true, s, n);
}
function triggerEvent(e, t = "", i = false, s = {}) {
  if (!is.element(e) || is.empty(t))
    return;
  const n = new CustomEvent(t, { bubbles: i, detail: { ...s, plyr: this } });
  e.dispatchEvent(n);
}
function unbindListeners() {
  this && this.eventListeners && (this.eventListeners.forEach((e) => {
    const { element: t, type: i, callback: s, options: n } = e;
    t.removeEventListener(i, s, n);
  }), this.eventListeners = []);
}
function ready() {
  return new Promise((e) => this.ready ? setTimeout(e, 0) : on.call(this, this.elements.container, "ready", e)).then(() => {
  });
}
function silencePromise(e) {
  is.promise(e) && e.then(null, () => {
  });
}
function dedupe(e) {
  return is.array(e) ? e.filter((t, i) => e.indexOf(t) === i) : e;
}
function closest(e, t) {
  return is.array(e) && e.length ? e.reduce((e2, i) => Math.abs(i - t) < Math.abs(e2 - t) ? i : e2) : null;
}
function supportsCSS(e) {
  return !(!window || !window.CSS) && window.CSS.supports(e);
}
const standardRatios = [[1, 1], [4, 3], [3, 4], [5, 4], [4, 5], [3, 2], [2, 3], [16, 10], [10, 16], [16, 9], [9, 16], [21, 9], [9, 21], [32, 9], [9, 32]].reduce((e, [t, i]) => ({ ...e, [t / i]: [t, i] }), {});
function validateAspectRatio(e) {
  if (!(is.array(e) || is.string(e) && e.includes(":")))
    return false;
  return (is.array(e) ? e : e.split(":")).map(Number).every(is.number);
}
function reduceAspectRatio(e) {
  if (!is.array(e) || !e.every(is.number))
    return null;
  const [t, i] = e, s = (e2, t2) => 0 === t2 ? e2 : s(t2, e2 % t2), n = s(t, i);
  return [t / n, i / n];
}
function getAspectRatio(e) {
  const t = (e2) => validateAspectRatio(e2) ? e2.split(":").map(Number) : null;
  let i = t(e);
  if (null === i && (i = t(this.config.ratio)), null === i && !is.empty(this.embed) && is.array(this.embed.ratio) && ({ ratio: i } = this.embed), null === i && this.isHTML5) {
    const { videoWidth: e2, videoHeight: t2 } = this.media;
    i = [e2, t2];
  }
  return reduceAspectRatio(i);
}
function setAspectRatio(e) {
  if (!this.isVideo)
    return {};
  const { wrapper: t } = this.elements, i = getAspectRatio.call(this, e);
  if (!is.array(i))
    return {};
  const [s, n] = reduceAspectRatio(i), r = 100 / s * n;
  if (supportsCSS(`aspect-ratio: ${s}/${n}`) ? t.style.aspectRatio = `${s}/${n}` : t.style.paddingBottom = `${r}%`, this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
    const e2 = 100 / this.media.offsetWidth * parseInt(window.getComputedStyle(this.media).paddingBottom, 10), i2 = (e2 - r) / (e2 / 50);
    this.fullscreen.active ? t.style.paddingBottom = null : this.media.style.transform = `translateY(-${i2}%)`;
  } else
    this.isHTML5 && t.classList.add(this.config.classNames.videoFixedRatio);
  return { padding: r, ratio: i };
}
function roundAspectRatio(e, t, i = 0.05) {
  const s = e / t, n = closest(Object.keys(standardRatios), s);
  return Math.abs(n - s) <= i ? standardRatios[n] : [e, t];
}
function getViewportSize() {
  return [Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0), Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)];
}
const html5 = { getSources() {
  if (!this.isHTML5)
    return [];
  return Array.from(this.media.querySelectorAll("source")).filter((e) => {
    const t = e.getAttribute("type");
    return !!is.empty(t) || support.mime.call(this, t);
  });
}, getQualityOptions() {
  return this.config.quality.forced ? this.config.quality.options : html5.getSources.call(this).map((e) => Number(e.getAttribute("size"))).filter(Boolean);
}, setup() {
  if (!this.isHTML5)
    return;
  const e = this;
  e.options.speed = e.config.speed.options, is.empty(this.config.ratio) || setAspectRatio.call(e), Object.defineProperty(e.media, "quality", { get() {
    const t = html5.getSources.call(e).find((t2) => t2.getAttribute("src") === e.source);
    return t && Number(t.getAttribute("size"));
  }, set(t) {
    if (e.quality !== t) {
      if (e.config.quality.forced && is.function(e.config.quality.onChange))
        e.config.quality.onChange(t);
      else {
        const i = html5.getSources.call(e).find((e2) => Number(e2.getAttribute("size")) === t);
        if (!i)
          return;
        const { currentTime: s, paused: n, preload: r, readyState: a, playbackRate: o } = e.media;
        e.media.src = i.getAttribute("src"), ("none" !== r || a) && (e.once("loadedmetadata", () => {
          e.speed = o, e.currentTime = s, n || silencePromise(e.play());
        }), e.media.load());
      }
      triggerEvent.call(e, e.media, "qualitychange", false, { quality: t });
    }
  } });
}, cancelRequests() {
  this.isHTML5 && (removeElement(html5.getSources.call(this)), this.media.setAttribute("src", this.config.blankVideo), this.media.load(), this.debug.log("Cancelled network requests"));
} };
function generateId(e) {
  return `${e}-${Math.floor(1e4 * Math.random())}`;
}
function format(e, ...t) {
  return is.empty(e) ? e : e.toString().replace(/{(\d+)}/g, (e2, i) => t[i].toString());
}
function getPercentage(e, t) {
  return 0 === e || 0 === t || Number.isNaN(e) || Number.isNaN(t) ? 0 : (e / t * 100).toFixed(2);
}
const replaceAll = (e = "", t = "", i = "") => e.replace(new RegExp(t.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"), "g"), i.toString()), toTitleCase = (e = "") => e.toString().replace(/\w\S*/g, (e2) => e2.charAt(0).toUpperCase() + e2.slice(1).toLowerCase());
function toPascalCase(e = "") {
  let t = e.toString();
  return t = replaceAll(t, "-", " "), t = replaceAll(t, "_", " "), t = toTitleCase(t), replaceAll(t, " ", "");
}
function toCamelCase(e = "") {
  let t = e.toString();
  return t = toPascalCase(t), t.charAt(0).toLowerCase() + t.slice(1);
}
function stripHTML(e) {
  const t = document.createDocumentFragment(), i = document.createElement("div");
  return t.appendChild(i), i.innerHTML = e, t.firstChild.innerText;
}
function getHTML(e) {
  const t = document.createElement("div");
  return t.appendChild(e), t.innerHTML;
}
const resources = { pip: "PIP", airplay: "AirPlay", html5: "HTML5", vimeo: "Vimeo", youtube: "YouTube" }, i18n = { get(e = "", t = {}) {
  if (is.empty(e) || is.empty(t))
    return "";
  let i = getDeep(t.i18n, e);
  if (is.empty(i))
    return Object.keys(resources).includes(e) ? resources[e] : "";
  const s = { "{seektime}": t.seekTime, "{title}": t.title };
  return Object.entries(s).forEach(([e2, t2]) => {
    i = replaceAll(i, e2, t2);
  }), i;
} };
class Storage {
  constructor(e) {
    _defineProperty$1(this, "get", (e2) => {
      if (!Storage.supported || !this.enabled)
        return null;
      const t = window.localStorage.getItem(this.key);
      if (is.empty(t))
        return null;
      const i = JSON.parse(t);
      return is.string(e2) && e2.length ? i[e2] : i;
    }), _defineProperty$1(this, "set", (e2) => {
      if (!Storage.supported || !this.enabled)
        return;
      if (!is.object(e2))
        return;
      let t = this.get();
      is.empty(t) && (t = {}), extend(t, e2);
      try {
        window.localStorage.setItem(this.key, JSON.stringify(t));
      } catch (e3) {
      }
    }), this.enabled = e.config.storage.enabled, this.key = e.config.storage.key;
  }
  static get supported() {
    try {
      if (!("localStorage" in window))
        return false;
      const e = "___test";
      return window.localStorage.setItem(e, e), window.localStorage.removeItem(e), true;
    } catch (e) {
      return false;
    }
  }
}
function fetch(e, t = "text") {
  return new Promise((i, s) => {
    try {
      const s2 = new XMLHttpRequest();
      if (!("withCredentials" in s2))
        return;
      s2.addEventListener("load", () => {
        if ("text" === t)
          try {
            i(JSON.parse(s2.responseText));
          } catch (e2) {
            i(s2.responseText);
          }
        else
          i(s2.response);
      }), s2.addEventListener("error", () => {
        throw new Error(s2.status);
      }), s2.open("GET", e, true), s2.responseType = t, s2.send();
    } catch (e2) {
      s(e2);
    }
  });
}
function loadSprite(e, t) {
  if (!is.string(e))
    return;
  const i = is.string(t);
  let s = false;
  const n = () => null !== document.getElementById(t), r = (e2, t2) => {
    e2.innerHTML = t2, i && n() || document.body.insertAdjacentElement("afterbegin", e2);
  };
  if (!i || !n()) {
    const n2 = Storage.supported, a = document.createElement("div");
    if (a.setAttribute("hidden", ""), i && a.setAttribute("id", t), n2) {
      const e2 = window.localStorage.getItem(`cache-${t}`);
      if (s = null !== e2, s) {
        const t2 = JSON.parse(e2);
        r(a, t2.content);
      }
    }
    fetch(e).then((e2) => {
      if (!is.empty(e2)) {
        if (n2)
          try {
            window.localStorage.setItem(`cache-${t}`, JSON.stringify({ content: e2 }));
          } catch (e3) {
          }
        r(a, e2);
      }
    }).catch(() => {
    });
  }
}
const getHours = (e) => Math.trunc(e / 60 / 60 % 60, 10), getSeconds = (e) => Math.trunc(e % 60, 10);
function formatTime(e = 0, t = false, i = false) {
  if (!is.number(e))
    return formatTime(void 0, t, i);
  const s = (e2) => `0${e2}`.slice(-2);
  let n = getHours(e);
  const r = (a = e, Math.trunc(a / 60 % 60, 10));
  var a;
  const o = getSeconds(e);
  return n = t || n > 0 ? `${n}:` : "", `${i && e > 0 ? "-" : ""}${n}${s(r)}:${s(o)}`;
}
const controls = { getIconUrl() {
  const e = new URL(this.config.iconUrl, window.location), t = window.location.host ? window.location.host : window.top.location.host, i = e.host !== t || browser.isIE && !window.svg4everybody;
  return { url: this.config.iconUrl, cors: i };
}, findElements() {
  try {
    return this.elements.controls = getElement.call(this, this.config.selectors.controls.wrapper), this.elements.buttons = { play: getElements.call(this, this.config.selectors.buttons.play), pause: getElement.call(this, this.config.selectors.buttons.pause), restart: getElement.call(this, this.config.selectors.buttons.restart), rewind: getElement.call(this, this.config.selectors.buttons.rewind), fastForward: getElement.call(this, this.config.selectors.buttons.fastForward), mute: getElement.call(this, this.config.selectors.buttons.mute), pip: getElement.call(this, this.config.selectors.buttons.pip), airplay: getElement.call(this, this.config.selectors.buttons.airplay), settings: getElement.call(this, this.config.selectors.buttons.settings), captions: getElement.call(this, this.config.selectors.buttons.captions), fullscreen: getElement.call(this, this.config.selectors.buttons.fullscreen) }, this.elements.progress = getElement.call(this, this.config.selectors.progress), this.elements.inputs = { seek: getElement.call(this, this.config.selectors.inputs.seek), volume: getElement.call(this, this.config.selectors.inputs.volume) }, this.elements.display = { buffer: getElement.call(this, this.config.selectors.display.buffer), currentTime: getElement.call(this, this.config.selectors.display.currentTime), duration: getElement.call(this, this.config.selectors.display.duration) }, is.element(this.elements.progress) && (this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`)), true;
  } catch (e) {
    return this.debug.warn("It looks like there is a problem with your custom controls HTML", e), this.toggleNativeControls(true), false;
  }
}, createIcon(e, t) {
  const i = "http://www.w3.org/2000/svg", s = controls.getIconUrl.call(this), n = `${s.cors ? "" : s.url}#${this.config.iconPrefix}`, r = document.createElementNS(i, "svg");
  setAttributes(r, extend(t, { "aria-hidden": "true", focusable: "false" }));
  const a = document.createElementNS(i, "use"), o = `${n}-${e}`;
  return "href" in a && a.setAttributeNS("http://www.w3.org/1999/xlink", "href", o), a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", o), r.appendChild(a), r;
}, createLabel(e, t = {}) {
  const i = i18n.get(e, this.config);
  return createElement("span", { ...t, class: [t.class, this.config.classNames.hidden].filter(Boolean).join(" ") }, i);
}, createBadge(e) {
  if (is.empty(e))
    return null;
  const t = createElement("span", { class: this.config.classNames.menu.value });
  return t.appendChild(createElement("span", { class: this.config.classNames.menu.badge }, e)), t;
}, createButton(e, t) {
  const i = extend({}, t);
  let s = toCamelCase(e);
  const n = { element: "button", toggle: false, label: null, icon: null, labelPressed: null, iconPressed: null };
  switch (["element", "icon", "label"].forEach((e2) => {
    Object.keys(i).includes(e2) && (n[e2] = i[e2], delete i[e2]);
  }), "button" !== n.element || Object.keys(i).includes("type") || (i.type = "button"), Object.keys(i).includes("class") ? i.class.split(" ").some((e2) => e2 === this.config.classNames.control) || extend(i, { class: `${i.class} ${this.config.classNames.control}` }) : i.class = this.config.classNames.control, e) {
    case "play":
      n.toggle = true, n.label = "play", n.labelPressed = "pause", n.icon = "play", n.iconPressed = "pause";
      break;
    case "mute":
      n.toggle = true, n.label = "mute", n.labelPressed = "unmute", n.icon = "volume", n.iconPressed = "muted";
      break;
    case "captions":
      n.toggle = true, n.label = "enableCaptions", n.labelPressed = "disableCaptions", n.icon = "captions-off", n.iconPressed = "captions-on";
      break;
    case "fullscreen":
      n.toggle = true, n.label = "enterFullscreen", n.labelPressed = "exitFullscreen", n.icon = "enter-fullscreen", n.iconPressed = "exit-fullscreen";
      break;
    case "play-large":
      i.class += ` ${this.config.classNames.control}--overlaid`, s = "play", n.label = "play", n.icon = "play";
      break;
    default:
      is.empty(n.label) && (n.label = s), is.empty(n.icon) && (n.icon = e);
  }
  const r = createElement(n.element);
  return n.toggle ? (r.appendChild(controls.createIcon.call(this, n.iconPressed, { class: "icon--pressed" })), r.appendChild(controls.createIcon.call(this, n.icon, { class: "icon--not-pressed" })), r.appendChild(controls.createLabel.call(this, n.labelPressed, { class: "label--pressed" })), r.appendChild(controls.createLabel.call(this, n.label, { class: "label--not-pressed" }))) : (r.appendChild(controls.createIcon.call(this, n.icon)), r.appendChild(controls.createLabel.call(this, n.label))), extend(i, getAttributesFromSelector(this.config.selectors.buttons[s], i)), setAttributes(r, i), "play" === s ? (is.array(this.elements.buttons[s]) || (this.elements.buttons[s] = []), this.elements.buttons[s].push(r)) : this.elements.buttons[s] = r, r;
}, createRange(e, t) {
  const i = createElement("input", extend(getAttributesFromSelector(this.config.selectors.inputs[e]), { type: "range", min: 0, max: 100, step: 0.01, value: 0, autocomplete: "off", role: "slider", "aria-label": i18n.get(e, this.config), "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0 }, t));
  return this.elements.inputs[e] = i, controls.updateRangeFill.call(this, i), RangeTouch.setup(i), i;
}, createProgress(e, t) {
  const i = createElement("progress", extend(getAttributesFromSelector(this.config.selectors.display[e]), { min: 0, max: 100, value: 0, role: "progressbar", "aria-hidden": true }, t));
  if ("volume" !== e) {
    i.appendChild(createElement("span", null, "0"));
    const t2 = { played: "played", buffer: "buffered" }[e], s = t2 ? i18n.get(t2, this.config) : "";
    i.innerText = `% ${s.toLowerCase()}`;
  }
  return this.elements.display[e] = i, i;
}, createTime(e, t) {
  const i = getAttributesFromSelector(this.config.selectors.display[e], t), s = createElement("div", extend(i, { class: `${i.class ? i.class : ""} ${this.config.classNames.display.time} `.trim(), "aria-label": i18n.get(e, this.config) }), "00:00");
  return this.elements.display[e] = s, s;
}, bindMenuItemShortcuts(e, t) {
  on.call(this, e, "keydown keyup", (i) => {
    if (!["Space", "ArrowUp", "ArrowDown", "ArrowRight"].includes(i.key))
      return;
    if (i.preventDefault(), i.stopPropagation(), "keydown" === i.type)
      return;
    const s = matches(e, '[role="menuitemradio"]');
    if (!s && ["Space", "ArrowRight"].includes(i.key))
      controls.showMenuPanel.call(this, t, true);
    else {
      let t2;
      "Space" !== i.key && ("ArrowDown" === i.key || s && "ArrowRight" === i.key ? (t2 = e.nextElementSibling, is.element(t2) || (t2 = e.parentNode.firstElementChild)) : (t2 = e.previousElementSibling, is.element(t2) || (t2 = e.parentNode.lastElementChild)), setFocus.call(this, t2, true));
    }
  }, false), on.call(this, e, "keyup", (e2) => {
    "Return" === e2.key && controls.focusFirstMenuItem.call(this, null, true);
  });
}, createMenuItem({ value: e, list: t, type: i, title: s, badge: n = null, checked: r = false }) {
  const a = getAttributesFromSelector(this.config.selectors.inputs[i]), o = createElement("button", extend(a, { type: "button", role: "menuitemradio", class: `${this.config.classNames.control} ${a.class ? a.class : ""}`.trim(), "aria-checked": r, value: e })), l = createElement("span");
  l.innerHTML = s, is.element(n) && l.appendChild(n), o.appendChild(l), Object.defineProperty(o, "checked", { enumerable: true, get: () => "true" === o.getAttribute("aria-checked"), set(e2) {
    e2 && Array.from(o.parentNode.children).filter((e3) => matches(e3, '[role="menuitemradio"]')).forEach((e3) => e3.setAttribute("aria-checked", "false")), o.setAttribute("aria-checked", e2 ? "true" : "false");
  } }), this.listeners.bind(o, "click keyup", (t2) => {
    if (!is.keyboardEvent(t2) || "Space" === t2.key) {
      switch (t2.preventDefault(), t2.stopPropagation(), o.checked = true, i) {
        case "language":
          this.currentTrack = Number(e);
          break;
        case "quality":
          this.quality = e;
          break;
        case "speed":
          this.speed = parseFloat(e);
      }
      controls.showMenuPanel.call(this, "home", is.keyboardEvent(t2));
    }
  }, i, false), controls.bindMenuItemShortcuts.call(this, o, i), t.appendChild(o);
}, formatTime(e = 0, t = false) {
  if (!is.number(e))
    return e;
  return formatTime(e, getHours(this.duration) > 0, t);
}, updateTimeDisplay(e = null, t = 0, i = false) {
  is.element(e) && is.number(t) && (e.innerText = controls.formatTime(t, i));
}, updateVolume() {
  this.supported.ui && (is.element(this.elements.inputs.volume) && controls.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume), is.element(this.elements.buttons.mute) && (this.elements.buttons.mute.pressed = this.muted || 0 === this.volume));
}, setRange(e, t = 0) {
  is.element(e) && (e.value = t, controls.updateRangeFill.call(this, e));
}, updateProgress(e) {
  if (!this.supported.ui || !is.event(e))
    return;
  let t = 0;
  const i = (e2, t2) => {
    const i2 = is.number(t2) ? t2 : 0, s = is.element(e2) ? e2 : this.elements.display.buffer;
    if (is.element(s)) {
      s.value = i2;
      const e3 = s.getElementsByTagName("span")[0];
      is.element(e3) && (e3.childNodes[0].nodeValue = i2);
    }
  };
  if (e)
    switch (e.type) {
      case "timeupdate":
      case "seeking":
      case "seeked":
        t = getPercentage(this.currentTime, this.duration), "timeupdate" === e.type && controls.setRange.call(this, this.elements.inputs.seek, t);
        break;
      case "playing":
      case "progress":
        i(this.elements.display.buffer, 100 * this.buffered);
    }
}, updateRangeFill(e) {
  const t = is.event(e) ? e.target : e;
  if (is.element(t) && "range" === t.getAttribute("type")) {
    if (matches(t, this.config.selectors.inputs.seek)) {
      t.setAttribute("aria-valuenow", this.currentTime);
      const e2 = controls.formatTime(this.currentTime), i = controls.formatTime(this.duration), s = i18n.get("seekLabel", this.config);
      t.setAttribute("aria-valuetext", s.replace("{currentTime}", e2).replace("{duration}", i));
    } else if (matches(t, this.config.selectors.inputs.volume)) {
      const e2 = 100 * t.value;
      t.setAttribute("aria-valuenow", e2), t.setAttribute("aria-valuetext", `${e2.toFixed(1)}%`);
    } else
      t.setAttribute("aria-valuenow", t.value);
    browser.isWebkit && t.style.setProperty("--value", t.value / t.max * 100 + "%");
  }
}, updateSeekTooltip(e) {
  var t, i;
  if (!this.config.tooltips.seek || !is.element(this.elements.inputs.seek) || !is.element(this.elements.display.seekTooltip) || 0 === this.duration)
    return;
  const s = this.elements.display.seekTooltip, n = `${this.config.classNames.tooltip}--visible`, r = (e2) => toggleClass(s, n, e2);
  if (this.touch)
    return void r(false);
  let a = 0;
  const o = this.elements.progress.getBoundingClientRect();
  if (is.event(e))
    a = 100 / o.width * (e.pageX - o.left);
  else {
    if (!hasClass(s, n))
      return;
    a = parseFloat(s.style.left, 10);
  }
  a < 0 ? a = 0 : a > 100 && (a = 100);
  const l = this.duration / 100 * a;
  s.innerText = controls.formatTime(l);
  const c = null === (t = this.config.markers) || void 0 === t || null === (i = t.points) || void 0 === i ? void 0 : i.find(({ time: e2 }) => e2 === Math.round(l));
  c && s.insertAdjacentHTML("afterbegin", `${c.label}<br>`), s.style.left = `${a}%`, is.event(e) && ["mouseenter", "mouseleave"].includes(e.type) && r("mouseenter" === e.type);
}, timeUpdate(e) {
  const t = !is.element(this.elements.display.duration) && this.config.invertTime;
  controls.updateTimeDisplay.call(this, this.elements.display.currentTime, t ? this.duration - this.currentTime : this.currentTime, t), e && "timeupdate" === e.type && this.media.seeking || controls.updateProgress.call(this, e);
}, durationUpdate() {
  if (!this.supported.ui || !this.config.invertTime && this.currentTime)
    return;
  if (this.duration >= 2 ** 32)
    return toggleHidden(this.elements.display.currentTime, true), void toggleHidden(this.elements.progress, true);
  is.element(this.elements.inputs.seek) && this.elements.inputs.seek.setAttribute("aria-valuemax", this.duration);
  const e = is.element(this.elements.display.duration);
  !e && this.config.displayDuration && this.paused && controls.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration), e && controls.updateTimeDisplay.call(this, this.elements.display.duration, this.duration), this.config.markers.enabled && controls.setMarkers.call(this), controls.updateSeekTooltip.call(this);
}, toggleMenuButton(e, t) {
  toggleHidden(this.elements.settings.buttons[e], !t);
}, updateSetting(e, t, i) {
  const s = this.elements.settings.panels[e];
  let n = null, r = t;
  if ("captions" === e)
    n = this.currentTrack;
  else {
    if (n = is.empty(i) ? this[e] : i, is.empty(n) && (n = this.config[e].default), !is.empty(this.options[e]) && !this.options[e].includes(n))
      return void this.debug.warn(`Unsupported value of '${n}' for ${e}`);
    if (!this.config[e].options.includes(n))
      return void this.debug.warn(`Disabled value of '${n}' for ${e}`);
  }
  if (is.element(r) || (r = s && s.querySelector('[role="menu"]')), !is.element(r))
    return;
  this.elements.settings.buttons[e].querySelector(`.${this.config.classNames.menu.value}`).innerHTML = controls.getLabel.call(this, e, n);
  const a = r && r.querySelector(`[value="${n}"]`);
  is.element(a) && (a.checked = true);
}, getLabel(e, t) {
  switch (e) {
    case "speed":
      return 1 === t ? i18n.get("normal", this.config) : `${t}&times;`;
    case "quality":
      if (is.number(t)) {
        const e2 = i18n.get(`qualityLabel.${t}`, this.config);
        return e2.length ? e2 : `${t}p`;
      }
      return toTitleCase(t);
    case "captions":
      return captions.getLabel.call(this);
    default:
      return null;
  }
}, setQualityMenu(e) {
  if (!is.element(this.elements.settings.panels.quality))
    return;
  const t = "quality", i = this.elements.settings.panels.quality.querySelector('[role="menu"]');
  is.array(e) && (this.options.quality = dedupe(e).filter((e2) => this.config.quality.options.includes(e2)));
  const s = !is.empty(this.options.quality) && this.options.quality.length > 1;
  if (controls.toggleMenuButton.call(this, t, s), emptyElement(i), controls.checkMenu.call(this), !s)
    return;
  const n = (e2) => {
    const t2 = i18n.get(`qualityBadge.${e2}`, this.config);
    return t2.length ? controls.createBadge.call(this, t2) : null;
  };
  this.options.quality.sort((e2, t2) => {
    const i2 = this.config.quality.options;
    return i2.indexOf(e2) > i2.indexOf(t2) ? 1 : -1;
  }).forEach((e2) => {
    controls.createMenuItem.call(this, { value: e2, list: i, type: t, title: controls.getLabel.call(this, "quality", e2), badge: n(e2) });
  }), controls.updateSetting.call(this, t, i);
}, setCaptionsMenu() {
  if (!is.element(this.elements.settings.panels.captions))
    return;
  const e = "captions", t = this.elements.settings.panels.captions.querySelector('[role="menu"]'), i = captions.getTracks.call(this), s = Boolean(i.length);
  if (controls.toggleMenuButton.call(this, e, s), emptyElement(t), controls.checkMenu.call(this), !s)
    return;
  const n = i.map((e2, i2) => ({ value: i2, checked: this.captions.toggled && this.currentTrack === i2, title: captions.getLabel.call(this, e2), badge: e2.language && controls.createBadge.call(this, e2.language.toUpperCase()), list: t, type: "language" }));
  n.unshift({ value: -1, checked: !this.captions.toggled, title: i18n.get("disabled", this.config), list: t, type: "language" }), n.forEach(controls.createMenuItem.bind(this)), controls.updateSetting.call(this, e, t);
}, setSpeedMenu() {
  if (!is.element(this.elements.settings.panels.speed))
    return;
  const e = "speed", t = this.elements.settings.panels.speed.querySelector('[role="menu"]');
  this.options.speed = this.options.speed.filter((e2) => e2 >= this.minimumSpeed && e2 <= this.maximumSpeed);
  const i = !is.empty(this.options.speed) && this.options.speed.length > 1;
  controls.toggleMenuButton.call(this, e, i), emptyElement(t), controls.checkMenu.call(this), i && (this.options.speed.forEach((i2) => {
    controls.createMenuItem.call(this, { value: i2, list: t, type: e, title: controls.getLabel.call(this, "speed", i2) });
  }), controls.updateSetting.call(this, e, t));
}, checkMenu() {
  const { buttons: e } = this.elements.settings, t = !is.empty(e) && Object.values(e).some((e2) => !e2.hidden);
  toggleHidden(this.elements.settings.menu, !t);
}, focusFirstMenuItem(e, t = false) {
  if (this.elements.settings.popup.hidden)
    return;
  let i = e;
  is.element(i) || (i = Object.values(this.elements.settings.panels).find((e2) => !e2.hidden));
  const s = i.querySelector('[role^="menuitem"]');
  setFocus.call(this, s, t);
}, toggleMenu(e) {
  const { popup: t } = this.elements.settings, i = this.elements.buttons.settings;
  if (!is.element(t) || !is.element(i))
    return;
  const { hidden: s } = t;
  let n = s;
  if (is.boolean(e))
    n = e;
  else if (is.keyboardEvent(e) && "Escape" === e.key)
    n = false;
  else if (is.event(e)) {
    const s2 = is.function(e.composedPath) ? e.composedPath()[0] : e.target, r = t.contains(s2);
    if (r || !r && e.target !== i && n)
      return;
  }
  i.setAttribute("aria-expanded", n), toggleHidden(t, !n), toggleClass(this.elements.container, this.config.classNames.menu.open, n), n && is.keyboardEvent(e) ? controls.focusFirstMenuItem.call(this, null, true) : n || s || setFocus.call(this, i, is.keyboardEvent(e));
}, getMenuSize(e) {
  const t = e.cloneNode(true);
  t.style.position = "absolute", t.style.opacity = 0, t.removeAttribute("hidden"), e.parentNode.appendChild(t);
  const i = t.scrollWidth, s = t.scrollHeight;
  return removeElement(t), { width: i, height: s };
}, showMenuPanel(e = "", t = false) {
  const i = this.elements.container.querySelector(`#plyr-settings-${this.id}-${e}`);
  if (!is.element(i))
    return;
  const s = i.parentNode, n = Array.from(s.children).find((e2) => !e2.hidden);
  if (support.transitions && !support.reducedMotion) {
    s.style.width = `${n.scrollWidth}px`, s.style.height = `${n.scrollHeight}px`;
    const e2 = controls.getMenuSize.call(this, i), t2 = (e3) => {
      e3.target === s && ["width", "height"].includes(e3.propertyName) && (s.style.width = "", s.style.height = "", off.call(this, s, transitionEndEvent, t2));
    };
    on.call(this, s, transitionEndEvent, t2), s.style.width = `${e2.width}px`, s.style.height = `${e2.height}px`;
  }
  toggleHidden(n, true), toggleHidden(i, false), controls.focusFirstMenuItem.call(this, i, t);
}, setDownloadUrl() {
  const e = this.elements.buttons.download;
  is.element(e) && e.setAttribute("href", this.download);
}, create(e) {
  const { bindMenuItemShortcuts: t, createButton: i, createProgress: s, createRange: n, createTime: r, setQualityMenu: a, setSpeedMenu: o, showMenuPanel: l } = controls;
  this.elements.controls = null, is.array(this.config.controls) && this.config.controls.includes("play-large") && this.elements.container.appendChild(i.call(this, "play-large"));
  const c = createElement("div", getAttributesFromSelector(this.config.selectors.controls.wrapper));
  this.elements.controls = c;
  const u = { class: "plyr__controls__item" };
  return dedupe(is.array(this.config.controls) ? this.config.controls : []).forEach((a2) => {
    if ("restart" === a2 && c.appendChild(i.call(this, "restart", u)), "rewind" === a2 && c.appendChild(i.call(this, "rewind", u)), "play" === a2 && c.appendChild(i.call(this, "play", u)), "fast-forward" === a2 && c.appendChild(i.call(this, "fast-forward", u)), "progress" === a2) {
      const t2 = createElement("div", { class: `${u.class} plyr__progress__container` }), i2 = createElement("div", getAttributesFromSelector(this.config.selectors.progress));
      if (i2.appendChild(n.call(this, "seek", { id: `plyr-seek-${e.id}` })), i2.appendChild(s.call(this, "buffer")), this.config.tooltips.seek) {
        const e2 = createElement("span", { class: this.config.classNames.tooltip }, "00:00");
        i2.appendChild(e2), this.elements.display.seekTooltip = e2;
      }
      this.elements.progress = i2, t2.appendChild(this.elements.progress), c.appendChild(t2);
    }
    if ("current-time" === a2 && c.appendChild(r.call(this, "currentTime", u)), "duration" === a2 && c.appendChild(r.call(this, "duration", u)), "mute" === a2 || "volume" === a2) {
      let { volume: t2 } = this.elements;
      if (is.element(t2) && c.contains(t2) || (t2 = createElement("div", extend({}, u, { class: `${u.class} plyr__volume`.trim() })), this.elements.volume = t2, c.appendChild(t2)), "mute" === a2 && t2.appendChild(i.call(this, "mute")), "volume" === a2 && !browser.isIos) {
        const i2 = { max: 1, step: 0.05, value: this.config.volume };
        t2.appendChild(n.call(this, "volume", extend(i2, { id: `plyr-volume-${e.id}` })));
      }
    }
    if ("captions" === a2 && c.appendChild(i.call(this, "captions", u)), "settings" === a2 && !is.empty(this.config.settings)) {
      const s2 = createElement("div", extend({}, u, { class: `${u.class} plyr__menu`.trim(), hidden: "" }));
      s2.appendChild(i.call(this, "settings", { "aria-haspopup": true, "aria-controls": `plyr-settings-${e.id}`, "aria-expanded": false }));
      const n2 = createElement("div", { class: "plyr__menu__container", id: `plyr-settings-${e.id}`, hidden: "" }), r2 = createElement("div"), a3 = createElement("div", { id: `plyr-settings-${e.id}-home` }), o2 = createElement("div", { role: "menu" });
      a3.appendChild(o2), r2.appendChild(a3), this.elements.settings.panels.home = a3, this.config.settings.forEach((i2) => {
        const s3 = createElement("button", extend(getAttributesFromSelector(this.config.selectors.buttons.settings), { type: "button", class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`, role: "menuitem", "aria-haspopup": true, hidden: "" }));
        t.call(this, s3, i2), on.call(this, s3, "click", () => {
          l.call(this, i2, false);
        });
        const n3 = createElement("span", null, i18n.get(i2, this.config)), a4 = createElement("span", { class: this.config.classNames.menu.value });
        a4.innerHTML = e[i2], n3.appendChild(a4), s3.appendChild(n3), o2.appendChild(s3);
        const c2 = createElement("div", { id: `plyr-settings-${e.id}-${i2}`, hidden: "" }), u2 = createElement("button", { type: "button", class: `${this.config.classNames.control} ${this.config.classNames.control}--back` });
        u2.appendChild(createElement("span", { "aria-hidden": true }, i18n.get(i2, this.config))), u2.appendChild(createElement("span", { class: this.config.classNames.hidden }, i18n.get("menuBack", this.config))), on.call(this, c2, "keydown", (e2) => {
          "ArrowLeft" === e2.key && (e2.preventDefault(), e2.stopPropagation(), l.call(this, "home", true));
        }, false), on.call(this, u2, "click", () => {
          l.call(this, "home", false);
        }), c2.appendChild(u2), c2.appendChild(createElement("div", { role: "menu" })), r2.appendChild(c2), this.elements.settings.buttons[i2] = s3, this.elements.settings.panels[i2] = c2;
      }), n2.appendChild(r2), s2.appendChild(n2), c.appendChild(s2), this.elements.settings.popup = n2, this.elements.settings.menu = s2;
    }
    if ("pip" === a2 && support.pip && c.appendChild(i.call(this, "pip", u)), "airplay" === a2 && support.airplay && c.appendChild(i.call(this, "airplay", u)), "download" === a2) {
      const e2 = extend({}, u, { element: "a", href: this.download, target: "_blank" });
      this.isHTML5 && (e2.download = "");
      const { download: t2 } = this.config.urls;
      !is.url(t2) && this.isEmbed && extend(e2, { icon: `logo-${this.provider}`, label: this.provider }), c.appendChild(i.call(this, "download", e2));
    }
    "fullscreen" === a2 && c.appendChild(i.call(this, "fullscreen", u));
  }), this.isHTML5 && a.call(this, html5.getQualityOptions.call(this)), o.call(this), c;
}, inject() {
  if (this.config.loadSprite) {
    const e2 = controls.getIconUrl.call(this);
    e2.cors && loadSprite(e2.url, "sprite-plyr");
  }
  this.id = Math.floor(1e4 * Math.random());
  let e = null;
  this.elements.controls = null;
  const t = { id: this.id, seektime: this.config.seekTime, title: this.config.title };
  let i = true;
  is.function(this.config.controls) && (this.config.controls = this.config.controls.call(this, t)), this.config.controls || (this.config.controls = []), is.element(this.config.controls) || is.string(this.config.controls) ? e = this.config.controls : (e = controls.create.call(this, { id: this.id, seektime: this.config.seekTime, speed: this.speed, quality: this.quality, captions: captions.getLabel.call(this) }), i = false);
  let s;
  i && is.string(this.config.controls) && (e = ((e2) => {
    let i2 = e2;
    return Object.entries(t).forEach(([e3, t2]) => {
      i2 = replaceAll(i2, `{${e3}}`, t2);
    }), i2;
  })(e)), is.string(this.config.selectors.controls.container) && (s = document.querySelector(this.config.selectors.controls.container)), is.element(s) || (s = this.elements.container);
  if (s[is.element(e) ? "insertAdjacentElement" : "insertAdjacentHTML"]("afterbegin", e), is.element(this.elements.controls) || controls.findElements.call(this), !is.empty(this.elements.buttons)) {
    const e2 = (e3) => {
      const t2 = this.config.classNames.controlPressed;
      e3.setAttribute("aria-pressed", "false"), Object.defineProperty(e3, "pressed", { configurable: true, enumerable: true, get: () => hasClass(e3, t2), set(i2 = false) {
        toggleClass(e3, t2, i2), e3.setAttribute("aria-pressed", i2 ? "true" : "false");
      } });
    };
    Object.values(this.elements.buttons).filter(Boolean).forEach((t2) => {
      is.array(t2) || is.nodeList(t2) ? Array.from(t2).filter(Boolean).forEach(e2) : e2(t2);
    });
  }
  if (browser.isEdge && repaint(s), this.config.tooltips.controls) {
    const { classNames: e2, selectors: t2 } = this.config, i2 = `${t2.controls.wrapper} ${t2.labels} .${e2.hidden}`, s2 = getElements.call(this, i2);
    Array.from(s2).forEach((e3) => {
      toggleClass(e3, this.config.classNames.hidden, false), toggleClass(e3, this.config.classNames.tooltip, true);
    });
  }
}, setMediaMetadata() {
  try {
    "mediaSession" in navigator && (navigator.mediaSession.metadata = new window.MediaMetadata({ title: this.config.mediaMetadata.title, artist: this.config.mediaMetadata.artist, album: this.config.mediaMetadata.album, artwork: this.config.mediaMetadata.artwork }));
  } catch (e) {
  }
}, setMarkers() {
  var e, t;
  if (!this.duration || this.elements.markers)
    return;
  const i = null === (e = this.config.markers) || void 0 === e || null === (t = e.points) || void 0 === t ? void 0 : t.filter(({ time: e2 }) => e2 > 0 && e2 < this.duration);
  if (null == i || !i.length)
    return;
  const s = document.createDocumentFragment(), n = document.createDocumentFragment();
  let r = null;
  const a = `${this.config.classNames.tooltip}--visible`, o = (e2) => toggleClass(r, a, e2);
  i.forEach((e2) => {
    const t2 = createElement("span", { class: this.config.classNames.marker }, ""), i2 = e2.time / this.duration * 100 + "%";
    r && (t2.addEventListener("mouseenter", () => {
      e2.label || (r.style.left = i2, r.innerHTML = e2.label, o(true));
    }), t2.addEventListener("mouseleave", () => {
      o(false);
    })), t2.addEventListener("click", () => {
      this.currentTime = e2.time;
    }), t2.style.left = i2, n.appendChild(t2);
  }), s.appendChild(n), this.config.tooltips.seek || (r = createElement("span", { class: this.config.classNames.tooltip }, ""), s.appendChild(r)), this.elements.markers = { points: n, tip: r }, this.elements.progress.appendChild(s);
} };
function parseUrl(e, t = true) {
  let i = e;
  if (t) {
    const e2 = document.createElement("a");
    e2.href = i, i = e2.href;
  }
  try {
    return new URL(i);
  } catch (e2) {
    return null;
  }
}
function buildUrlParams(e) {
  const t = new URLSearchParams();
  return is.object(e) && Object.entries(e).forEach(([e2, i]) => {
    t.set(e2, i);
  }), t;
}
const captions = { setup() {
  if (!this.supported.ui)
    return;
  if (!this.isVideo || this.isYouTube || this.isHTML5 && !support.textTracks)
    return void (is.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && controls.setCaptionsMenu.call(this));
  if (is.element(this.elements.captions) || (this.elements.captions = createElement("div", getAttributesFromSelector(this.config.selectors.captions)), this.elements.captions.setAttribute("dir", "auto"), insertAfter(this.elements.captions, this.elements.wrapper)), browser.isIE && window.URL) {
    const e2 = this.media.querySelectorAll("track");
    Array.from(e2).forEach((e3) => {
      const t2 = e3.getAttribute("src"), i2 = parseUrl(t2);
      null !== i2 && i2.hostname !== window.location.href.hostname && ["http:", "https:"].includes(i2.protocol) && fetch(t2, "blob").then((t3) => {
        e3.setAttribute("src", window.URL.createObjectURL(t3));
      }).catch(() => {
        removeElement(e3);
      });
    });
  }
  const e = dedupe((navigator.languages || [navigator.language || navigator.userLanguage || "en"]).map((e2) => e2.split("-")[0]));
  let t = (this.storage.get("language") || this.config.captions.language || "auto").toLowerCase();
  "auto" === t && ([t] = e);
  let i = this.storage.get("captions");
  if (is.boolean(i) || ({ active: i } = this.config.captions), Object.assign(this.captions, { toggled: false, active: i, language: t, languages: e }), this.isHTML5) {
    const e2 = this.config.captions.update ? "addtrack removetrack" : "removetrack";
    on.call(this, this.media.textTracks, e2, captions.update.bind(this));
  }
  setTimeout(captions.update.bind(this), 0);
}, update() {
  const e = captions.getTracks.call(this, true), { active: t, language: i, meta: s, currentTrackNode: n } = this.captions, r = Boolean(e.find((e2) => e2.language === i));
  this.isHTML5 && this.isVideo && e.filter((e2) => !s.get(e2)).forEach((e2) => {
    this.debug.log("Track added", e2), s.set(e2, { default: "showing" === e2.mode }), "showing" === e2.mode && (e2.mode = "hidden"), on.call(this, e2, "cuechange", () => captions.updateCues.call(this));
  }), (r && this.language !== i || !e.includes(n)) && (captions.setLanguage.call(this, i), captions.toggle.call(this, t && r)), this.elements && toggleClass(this.elements.container, this.config.classNames.captions.enabled, !is.empty(e)), is.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && controls.setCaptionsMenu.call(this);
}, toggle(e, t = true) {
  if (!this.supported.ui)
    return;
  const { toggled: i } = this.captions, s = this.config.classNames.captions.active, n = is.nullOrUndefined(e) ? !i : e;
  if (n !== i) {
    if (t || (this.captions.active = n, this.storage.set({ captions: n })), !this.language && n && !t) {
      const e2 = captions.getTracks.call(this), t2 = captions.findTrack.call(this, [this.captions.language, ...this.captions.languages], true);
      return this.captions.language = t2.language, void captions.set.call(this, e2.indexOf(t2));
    }
    this.elements.buttons.captions && (this.elements.buttons.captions.pressed = n), toggleClass(this.elements.container, s, n), this.captions.toggled = n, controls.updateSetting.call(this, "captions"), triggerEvent.call(this, this.media, n ? "captionsenabled" : "captionsdisabled");
  }
  setTimeout(() => {
    n && this.captions.toggled && (this.captions.currentTrackNode.mode = "hidden");
  });
}, set(e, t = true) {
  const i = captions.getTracks.call(this);
  if (-1 !== e)
    if (is.number(e))
      if (e in i) {
        if (this.captions.currentTrack !== e) {
          this.captions.currentTrack = e;
          const s = i[e], { language: n } = s || {};
          this.captions.currentTrackNode = s, controls.updateSetting.call(this, "captions"), t || (this.captions.language = n, this.storage.set({ language: n })), this.isVimeo && this.embed.enableTextTrack(n), triggerEvent.call(this, this.media, "languagechange");
        }
        captions.toggle.call(this, true, t), this.isHTML5 && this.isVideo && captions.updateCues.call(this);
      } else
        this.debug.warn("Track not found", e);
    else
      this.debug.warn("Invalid caption argument", e);
  else
    captions.toggle.call(this, false, t);
}, setLanguage(e, t = true) {
  if (!is.string(e))
    return void this.debug.warn("Invalid language argument", e);
  const i = e.toLowerCase();
  this.captions.language = i;
  const s = captions.getTracks.call(this), n = captions.findTrack.call(this, [i]);
  captions.set.call(this, s.indexOf(n), t);
}, getTracks(e = false) {
  return Array.from((this.media || {}).textTracks || []).filter((t) => !this.isHTML5 || e || this.captions.meta.has(t)).filter((e2) => ["captions", "subtitles"].includes(e2.kind));
}, findTrack(e, t = false) {
  const i = captions.getTracks.call(this), s = (e2) => Number((this.captions.meta.get(e2) || {}).default), n = Array.from(i).sort((e2, t2) => s(t2) - s(e2));
  let r;
  return e.every((e2) => (r = n.find((t2) => t2.language === e2), !r)), r || (t ? n[0] : void 0);
}, getCurrentTrack() {
  return captions.getTracks.call(this)[this.currentTrack];
}, getLabel(e) {
  let t = e;
  return !is.track(t) && support.textTracks && this.captions.toggled && (t = captions.getCurrentTrack.call(this)), is.track(t) ? is.empty(t.label) ? is.empty(t.language) ? i18n.get("enabled", this.config) : e.language.toUpperCase() : t.label : i18n.get("disabled", this.config);
}, updateCues(e) {
  if (!this.supported.ui)
    return;
  if (!is.element(this.elements.captions))
    return void this.debug.warn("No captions element to render to");
  if (!is.nullOrUndefined(e) && !Array.isArray(e))
    return void this.debug.warn("updateCues: Invalid input", e);
  let t = e;
  if (!t) {
    const e2 = captions.getCurrentTrack.call(this);
    t = Array.from((e2 || {}).activeCues || []).map((e3) => e3.getCueAsHTML()).map(getHTML);
  }
  const i = t.map((e2) => e2.trim()).join("\n");
  if (i !== this.elements.captions.innerHTML) {
    emptyElement(this.elements.captions);
    const e2 = createElement("span", getAttributesFromSelector(this.config.selectors.caption));
    e2.innerHTML = i, this.elements.captions.appendChild(e2), triggerEvent.call(this, this.media, "cuechange");
  }
} }, defaults = { enabled: true, title: "", debug: false, autoplay: false, autopause: true, playsinline: true, seekTime: 10, volume: 1, muted: false, duration: null, displayDuration: true, invertTime: true, toggleInvert: true, ratio: null, clickToPlay: true, hideControls: true, resetOnEnd: false, disableContextMenu: true, loadSprite: true, iconPrefix: "plyr", iconUrl: "https://cdn.plyr.io/3.7.3/plyr.svg", blankVideo: "https://cdn.plyr.io/static/blank.mp4", quality: { default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240], forced: false, onChange: null }, loop: { active: false }, speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] }, keyboard: { focused: true, global: false }, tooltips: { controls: false, seek: true }, captions: { active: false, language: "auto", update: false }, fullscreen: { enabled: true, fallback: true, iosNative: false }, storage: { enabled: true, key: "plyr" }, controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"], settings: ["captions", "quality", "speed"], i18n: { restart: "Restart", rewind: "Rewind {seektime}s", play: "Play", pause: "Pause", fastForward: "Forward {seektime}s", seek: "Seek", seekLabel: "{currentTime} of {duration}", played: "Played", buffered: "Buffered", currentTime: "Current time", duration: "Duration", volume: "Volume", mute: "Mute", unmute: "Unmute", enableCaptions: "Enable captions", disableCaptions: "Disable captions", download: "Download", enterFullscreen: "Enter fullscreen", exitFullscreen: "Exit fullscreen", frameTitle: "Player for {title}", captions: "Captions", settings: "Settings", pip: "PIP", menuBack: "Go back to previous menu", speed: "Speed", normal: "Normal", quality: "Quality", loop: "Loop", start: "Start", end: "End", all: "All", reset: "Reset", disabled: "Disabled", enabled: "Enabled", advertisement: "Ad", qualityBadge: { 2160: "4K", 1440: "HD", 1080: "HD", 720: "HD", 576: "SD", 480: "SD" } }, urls: { download: null, vimeo: { sdk: "https://player.vimeo.com/api/player.js", iframe: "https://player.vimeo.com/video/{0}?{1}", api: "https://vimeo.com/api/oembed.json?url={0}" }, youtube: { sdk: "https://www.youtube.com/iframe_api", api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}" }, googleIMA: { sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js" } }, listeners: { seek: null, play: null, pause: null, restart: null, rewind: null, fastForward: null, mute: null, volume: null, captions: null, download: null, fullscreen: null, pip: null, airplay: null, speed: null, quality: null, loop: null, language: null }, events: ["ended", "progress", "stalled", "playing", "waiting", "canplay", "canplaythrough", "loadstart", "loadeddata", "loadedmetadata", "timeupdate", "volumechange", "play", "pause", "error", "seeking", "seeked", "emptied", "ratechange", "cuechange", "download", "enterfullscreen", "exitfullscreen", "captionsenabled", "captionsdisabled", "languagechange", "controlshidden", "controlsshown", "ready", "statechange", "qualitychange", "adsloaded", "adscontentpause", "adscontentresume", "adstarted", "adsmidpoint", "adscomplete", "adsallcomplete", "adsimpression", "adsclick"], selectors: { editable: "input, textarea, select, [contenteditable]", container: ".plyr", controls: { container: null, wrapper: ".plyr__controls" }, labels: "[data-plyr]", buttons: { play: '[data-plyr="play"]', pause: '[data-plyr="pause"]', restart: '[data-plyr="restart"]', rewind: '[data-plyr="rewind"]', fastForward: '[data-plyr="fast-forward"]', mute: '[data-plyr="mute"]', captions: '[data-plyr="captions"]', download: '[data-plyr="download"]', fullscreen: '[data-plyr="fullscreen"]', pip: '[data-plyr="pip"]', airplay: '[data-plyr="airplay"]', settings: '[data-plyr="settings"]', loop: '[data-plyr="loop"]' }, inputs: { seek: '[data-plyr="seek"]', volume: '[data-plyr="volume"]', speed: '[data-plyr="speed"]', language: '[data-plyr="language"]', quality: '[data-plyr="quality"]' }, display: { currentTime: ".plyr__time--current", duration: ".plyr__time--duration", buffer: ".plyr__progress__buffer", loop: ".plyr__progress__loop", volume: ".plyr__volume--display" }, progress: ".plyr__progress", captions: ".plyr__captions", caption: ".plyr__caption" }, classNames: { type: "plyr--{0}", provider: "plyr--{0}", video: "plyr__video-wrapper", embed: "plyr__video-embed", videoFixedRatio: "plyr__video-wrapper--fixed-ratio", embedContainer: "plyr__video-embed__container", poster: "plyr__poster", posterEnabled: "plyr__poster-enabled", ads: "plyr__ads", control: "plyr__control", controlPressed: "plyr__control--pressed", playing: "plyr--playing", paused: "plyr--paused", stopped: "plyr--stopped", loading: "plyr--loading", hover: "plyr--hover", tooltip: "plyr__tooltip", cues: "plyr__cues", marker: "plyr__progress__marker", hidden: "plyr__sr-only", hideControls: "plyr--hide-controls", isIos: "plyr--is-ios", isTouch: "plyr--is-touch", uiSupported: "plyr--full-ui", noTransition: "plyr--no-transition", display: { time: "plyr__time" }, menu: { value: "plyr__menu__value", badge: "plyr__badge", open: "plyr--menu-open" }, captions: { enabled: "plyr--captions-enabled", active: "plyr--captions-active" }, fullscreen: { enabled: "plyr--fullscreen-enabled", fallback: "plyr--fullscreen-fallback" }, pip: { supported: "plyr--pip-supported", active: "plyr--pip-active" }, airplay: { supported: "plyr--airplay-supported", active: "plyr--airplay-active" }, tabFocus: "plyr__tab-focus", previewThumbnails: { thumbContainer: "plyr__preview-thumb", thumbContainerShown: "plyr__preview-thumb--is-shown", imageContainer: "plyr__preview-thumb__image-container", timeContainer: "plyr__preview-thumb__time-container", scrubbingContainer: "plyr__preview-scrubbing", scrubbingContainerShown: "plyr__preview-scrubbing--is-shown" } }, attributes: { embed: { provider: "data-plyr-provider", id: "data-plyr-embed-id", hash: "data-plyr-embed-hash" } }, ads: { enabled: false, publisherId: "", tagUrl: "" }, previewThumbnails: { enabled: false, src: "" }, vimeo: { byline: false, portrait: false, title: false, speed: true, transparent: false, customControls: true, referrerPolicy: null, premium: false }, youtube: { rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, customControls: true, noCookie: false }, mediaMetadata: { title: "", artist: "", album: "", artwork: [] }, markers: { enabled: false, points: [] } }, pip = { active: "picture-in-picture", inactive: "inline" }, providers = { html5: "html5", youtube: "youtube", vimeo: "vimeo" }, types = { audio: "audio", video: "video" };
function getProviderByUrl(e) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(e) ? providers.youtube : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(e) ? providers.vimeo : null;
}
const noop = () => {
};
class Console {
  constructor(e = false) {
    this.enabled = window.console && e, this.enabled && this.log("Debugging enabled");
  }
  get log() {
    return this.enabled ? Function.prototype.bind.call(console.log, console) : noop;
  }
  get warn() {
    return this.enabled ? Function.prototype.bind.call(console.warn, console) : noop;
  }
  get error() {
    return this.enabled ? Function.prototype.bind.call(console.error, console) : noop;
  }
}
class Fullscreen {
  constructor(e) {
    _defineProperty$1(this, "onChange", () => {
      if (!this.enabled)
        return;
      const e2 = this.player.elements.buttons.fullscreen;
      is.element(e2) && (e2.pressed = this.active);
      const t = this.target === this.player.media ? this.target : this.player.elements.container;
      triggerEvent.call(this.player, t, this.active ? "enterfullscreen" : "exitfullscreen", true);
    }), _defineProperty$1(this, "toggleFallback", (e2 = false) => {
      if (e2 ? this.scrollPosition = { x: window.scrollX || 0, y: window.scrollY || 0 } : window.scrollTo(this.scrollPosition.x, this.scrollPosition.y), document.body.style.overflow = e2 ? "hidden" : "", toggleClass(this.target, this.player.config.classNames.fullscreen.fallback, e2), browser.isIos) {
        let t = document.head.querySelector('meta[name="viewport"]');
        const i = "viewport-fit=cover";
        t || (t = document.createElement("meta"), t.setAttribute("name", "viewport"));
        const s = is.string(t.content) && t.content.includes(i);
        e2 ? (this.cleanupViewport = !s, s || (t.content += `,${i}`)) : this.cleanupViewport && (t.content = t.content.split(",").filter((e3) => e3.trim() !== i).join(","));
      }
      this.onChange();
    }), _defineProperty$1(this, "trapFocus", (e2) => {
      if (browser.isIos || !this.active || "Tab" !== e2.key)
        return;
      const t = document.activeElement, i = getElements.call(this.player, "a[href], button:not(:disabled), input:not(:disabled), [tabindex]"), [s] = i, n = i[i.length - 1];
      t !== n || e2.shiftKey ? t === s && e2.shiftKey && (n.focus(), e2.preventDefault()) : (s.focus(), e2.preventDefault());
    }), _defineProperty$1(this, "update", () => {
      if (this.enabled) {
        let e2;
        e2 = this.forceFallback ? "Fallback (forced)" : Fullscreen.native ? "Native" : "Fallback", this.player.debug.log(`${e2} fullscreen enabled`);
      } else
        this.player.debug.log("Fullscreen not supported and fallback disabled");
      toggleClass(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.enabled);
    }), _defineProperty$1(this, "enter", () => {
      this.enabled && (browser.isIos && this.player.config.fullscreen.iosNative ? this.player.isVimeo ? this.player.embed.requestFullscreen() : this.target.webkitEnterFullscreen() : !Fullscreen.native || this.forceFallback ? this.toggleFallback(true) : this.prefix ? is.empty(this.prefix) || this.target[`${this.prefix}Request${this.property}`]() : this.target.requestFullscreen({ navigationUI: "hide" }));
    }), _defineProperty$1(this, "exit", () => {
      if (this.enabled)
        if (browser.isIos && this.player.config.fullscreen.iosNative)
          this.target.webkitExitFullscreen(), silencePromise(this.player.play());
        else if (!Fullscreen.native || this.forceFallback)
          this.toggleFallback(false);
        else if (this.prefix) {
          if (!is.empty(this.prefix)) {
            const e2 = "moz" === this.prefix ? "Cancel" : "Exit";
            document[`${this.prefix}${e2}${this.property}`]();
          }
        } else
          (document.cancelFullScreen || document.exitFullscreen).call(document);
    }), _defineProperty$1(this, "toggle", () => {
      this.active ? this.exit() : this.enter();
    }), this.player = e, this.prefix = Fullscreen.prefix, this.property = Fullscreen.property, this.scrollPosition = { x: 0, y: 0 }, this.forceFallback = "force" === e.config.fullscreen.fallback, this.player.elements.fullscreen = e.config.fullscreen.container && closest$1(this.player.elements.container, e.config.fullscreen.container), on.call(this.player, document, "ms" === this.prefix ? "MSFullscreenChange" : `${this.prefix}fullscreenchange`, () => {
      this.onChange();
    }), on.call(this.player, this.player.elements.container, "dblclick", (e2) => {
      is.element(this.player.elements.controls) && this.player.elements.controls.contains(e2.target) || this.player.listeners.proxy(e2, this.toggle, "fullscreen");
    }), on.call(this, this.player.elements.container, "keydown", (e2) => this.trapFocus(e2)), this.update();
  }
  static get native() {
    return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
  }
  get usingNative() {
    return Fullscreen.native && !this.forceFallback;
  }
  static get prefix() {
    if (is.function(document.exitFullscreen))
      return "";
    let e = "";
    return ["webkit", "moz", "ms"].some((t) => !(!is.function(document[`${t}ExitFullscreen`]) && !is.function(document[`${t}CancelFullScreen`])) && (e = t, true)), e;
  }
  static get property() {
    return "moz" === this.prefix ? "FullScreen" : "Fullscreen";
  }
  get enabled() {
    return (Fullscreen.native || this.player.config.fullscreen.fallback) && this.player.config.fullscreen.enabled && this.player.supported.ui && this.player.isVideo;
  }
  get active() {
    if (!this.enabled)
      return false;
    if (!Fullscreen.native || this.forceFallback)
      return hasClass(this.target, this.player.config.classNames.fullscreen.fallback);
    const e = this.prefix ? this.target.getRootNode()[`${this.prefix}${this.property}Element`] : this.target.getRootNode().fullscreenElement;
    return e && e.shadowRoot ? e === this.target.getRootNode().host : e === this.target;
  }
  get target() {
    return browser.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.fullscreen || this.player.elements.container;
  }
}
function loadImage(e, t = 1) {
  return new Promise((i, s) => {
    const n = new Image(), r = () => {
      delete n.onload, delete n.onerror, (n.naturalWidth >= t ? i : s)(n);
    };
    Object.assign(n, { onload: r, onerror: r, src: e });
  });
}
const ui = { addStyleHook() {
  toggleClass(this.elements.container, this.config.selectors.container.replace(".", ""), true), toggleClass(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
}, toggleNativeControls(e = false) {
  e && this.isHTML5 ? this.media.setAttribute("controls", "") : this.media.removeAttribute("controls");
}, build() {
  if (this.listeners.media(), !this.supported.ui)
    return this.debug.warn(`Basic support only for ${this.provider} ${this.type}`), void ui.toggleNativeControls.call(this, true);
  is.element(this.elements.controls) || (controls.inject.call(this), this.listeners.controls()), ui.toggleNativeControls.call(this), this.isHTML5 && captions.setup.call(this), this.volume = null, this.muted = null, this.loop = null, this.quality = null, this.speed = null, controls.updateVolume.call(this), controls.timeUpdate.call(this), controls.durationUpdate.call(this), ui.checkPlaying.call(this), toggleClass(this.elements.container, this.config.classNames.pip.supported, support.pip && this.isHTML5 && this.isVideo), toggleClass(this.elements.container, this.config.classNames.airplay.supported, support.airplay && this.isHTML5), toggleClass(this.elements.container, this.config.classNames.isIos, browser.isIos), toggleClass(this.elements.container, this.config.classNames.isTouch, this.touch), this.ready = true, setTimeout(() => {
    triggerEvent.call(this, this.media, "ready");
  }, 0), ui.setTitle.call(this), this.poster && ui.setPoster.call(this, this.poster, false).catch(() => {
  }), this.config.duration && controls.durationUpdate.call(this), this.config.mediaMetadata && controls.setMediaMetadata.call(this);
}, setTitle() {
  let e = i18n.get("play", this.config);
  if (is.string(this.config.title) && !is.empty(this.config.title) && (e += `, ${this.config.title}`), Array.from(this.elements.buttons.play || []).forEach((t) => {
    t.setAttribute("aria-label", e);
  }), this.isEmbed) {
    const e2 = getElement.call(this, "iframe");
    if (!is.element(e2))
      return;
    const t = is.empty(this.config.title) ? "video" : this.config.title, i = i18n.get("frameTitle", this.config);
    e2.setAttribute("title", i.replace("{title}", t));
  }
}, togglePoster(e) {
  toggleClass(this.elements.container, this.config.classNames.posterEnabled, e);
}, setPoster(e, t = true) {
  return t && this.poster ? Promise.reject(new Error("Poster already set")) : (this.media.setAttribute("data-poster", e), this.elements.poster.removeAttribute("hidden"), ready.call(this).then(() => loadImage(e)).catch((t2) => {
    throw e === this.poster && ui.togglePoster.call(this, false), t2;
  }).then(() => {
    if (e !== this.poster)
      throw new Error("setPoster cancelled by later call to setPoster");
  }).then(() => (Object.assign(this.elements.poster.style, { backgroundImage: `url('${e}')`, backgroundSize: "" }), ui.togglePoster.call(this, true), e)));
}, checkPlaying(e) {
  toggleClass(this.elements.container, this.config.classNames.playing, this.playing), toggleClass(this.elements.container, this.config.classNames.paused, this.paused), toggleClass(this.elements.container, this.config.classNames.stopped, this.stopped), Array.from(this.elements.buttons.play || []).forEach((e2) => {
    Object.assign(e2, { pressed: this.playing }), e2.setAttribute("aria-label", i18n.get(this.playing ? "pause" : "play", this.config));
  }), is.event(e) && "timeupdate" === e.type || ui.toggleControls.call(this);
}, checkLoading(e) {
  this.loading = ["stalled", "waiting"].includes(e.type), clearTimeout(this.timers.loading), this.timers.loading = setTimeout(() => {
    toggleClass(this.elements.container, this.config.classNames.loading, this.loading), ui.toggleControls.call(this);
  }, this.loading ? 250 : 0);
}, toggleControls(e) {
  const { controls: t } = this.elements;
  if (t && this.config.hideControls) {
    const i = this.touch && this.lastSeekTime + 2e3 > Date.now();
    this.toggleControls(Boolean(e || this.loading || this.paused || t.pressed || t.hover || i));
  }
}, migrateStyles() {
  Object.values({ ...this.media.style }).filter((e) => !is.empty(e) && is.string(e) && e.startsWith("--plyr")).forEach((e) => {
    this.elements.container.style.setProperty(e, this.media.style.getPropertyValue(e)), this.media.style.removeProperty(e);
  }), is.empty(this.media.style) && this.media.removeAttribute("style");
} };
class Listeners {
  constructor(e) {
    _defineProperty$1(this, "firstTouch", () => {
      const { player: e2 } = this, { elements: t } = e2;
      e2.touch = true, toggleClass(t.container, e2.config.classNames.isTouch, true);
    }), _defineProperty$1(this, "setTabFocus", (e2) => {
      const { player: t } = this, { elements: i } = t, { key: s, type: n, timeStamp: r } = e2;
      if (clearTimeout(this.focusTimer), "keydown" === n && "Tab" !== s)
        return;
      "keydown" === n && (this.lastKeyDown = r);
      const a = r - this.lastKeyDown <= 20;
      ("focus" !== n || a) && ((() => {
        const e3 = t.config.classNames.tabFocus;
        toggleClass(getElements.call(t, `.${e3}`), e3, false);
      })(), "focusout" !== n && (this.focusTimer = setTimeout(() => {
        const e3 = document.activeElement;
        i.container.contains(e3) && toggleClass(document.activeElement, t.config.classNames.tabFocus, true);
      }, 10)));
    }), _defineProperty$1(this, "global", (e2 = true) => {
      const { player: t } = this;
      t.config.keyboard.global && toggleListener.call(t, window, "keydown keyup", this.handleKey, e2, false), toggleListener.call(t, document.body, "click", this.toggleMenu, e2), once.call(t, document.body, "touchstart", this.firstTouch), toggleListener.call(t, document.body, "keydown focus blur focusout", this.setTabFocus, e2, false, true);
    }), _defineProperty$1(this, "container", () => {
      const { player: e2 } = this, { config: t, elements: i, timers: s } = e2;
      !t.keyboard.global && t.keyboard.focused && on.call(e2, i.container, "keydown keyup", this.handleKey, false), on.call(e2, i.container, "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen", (t2) => {
        const { controls: n2 } = i;
        n2 && "enterfullscreen" === t2.type && (n2.pressed = false, n2.hover = false);
        let r2 = 0;
        ["touchstart", "touchmove", "mousemove"].includes(t2.type) && (ui.toggleControls.call(e2, true), r2 = e2.touch ? 3e3 : 2e3), clearTimeout(s.controls), s.controls = setTimeout(() => ui.toggleControls.call(e2, false), r2);
      });
      const n = () => {
        if (!e2.isVimeo || e2.config.vimeo.premium)
          return;
        const t2 = i.wrapper, { active: s2 } = e2.fullscreen, [n2, r2] = getAspectRatio.call(e2), a = supportsCSS(`aspect-ratio: ${n2} / ${r2}`);
        if (!s2)
          return void (a ? (t2.style.width = null, t2.style.height = null) : (t2.style.maxWidth = null, t2.style.margin = null));
        const [o, l] = getViewportSize(), c = o / l > n2 / r2;
        a ? (t2.style.width = c ? "auto" : "100%", t2.style.height = c ? "100%" : "auto") : (t2.style.maxWidth = c ? l / r2 * n2 + "px" : null, t2.style.margin = c ? "0 auto" : null);
      }, r = () => {
        clearTimeout(s.resized), s.resized = setTimeout(n, 50);
      };
      on.call(e2, i.container, "enterfullscreen exitfullscreen", (t2) => {
        const { target: s2 } = e2.fullscreen;
        if (s2 !== i.container)
          return;
        if (!e2.isEmbed && is.empty(e2.config.ratio))
          return;
        n();
        ("enterfullscreen" === t2.type ? on : off).call(e2, window, "resize", r);
      });
    }), _defineProperty$1(this, "media", () => {
      const { player: e2 } = this, { elements: t } = e2;
      if (on.call(e2, e2.media, "timeupdate seeking seeked", (t2) => controls.timeUpdate.call(e2, t2)), on.call(e2, e2.media, "durationchange loadeddata loadedmetadata", (t2) => controls.durationUpdate.call(e2, t2)), on.call(e2, e2.media, "ended", () => {
        e2.isHTML5 && e2.isVideo && e2.config.resetOnEnd && (e2.restart(), e2.pause());
      }), on.call(e2, e2.media, "progress playing seeking seeked", (t2) => controls.updateProgress.call(e2, t2)), on.call(e2, e2.media, "volumechange", (t2) => controls.updateVolume.call(e2, t2)), on.call(e2, e2.media, "playing play pause ended emptied timeupdate", (t2) => ui.checkPlaying.call(e2, t2)), on.call(e2, e2.media, "waiting canplay seeked playing", (t2) => ui.checkLoading.call(e2, t2)), e2.supported.ui && e2.config.clickToPlay && !e2.isAudio) {
        const i2 = getElement.call(e2, `.${e2.config.classNames.video}`);
        if (!is.element(i2))
          return;
        on.call(e2, t.container, "click", (s) => {
          ([t.container, i2].includes(s.target) || i2.contains(s.target)) && (e2.touch && e2.config.hideControls || (e2.ended ? (this.proxy(s, e2.restart, "restart"), this.proxy(s, () => {
            silencePromise(e2.play());
          }, "play")) : this.proxy(s, () => {
            silencePromise(e2.togglePlay());
          }, "play")));
        });
      }
      e2.supported.ui && e2.config.disableContextMenu && on.call(e2, t.wrapper, "contextmenu", (e3) => {
        e3.preventDefault();
      }, false), on.call(e2, e2.media, "volumechange", () => {
        e2.storage.set({ volume: e2.volume, muted: e2.muted });
      }), on.call(e2, e2.media, "ratechange", () => {
        controls.updateSetting.call(e2, "speed"), e2.storage.set({ speed: e2.speed });
      }), on.call(e2, e2.media, "qualitychange", (t2) => {
        controls.updateSetting.call(e2, "quality", null, t2.detail.quality);
      }), on.call(e2, e2.media, "ready qualitychange", () => {
        controls.setDownloadUrl.call(e2);
      });
      const i = e2.config.events.concat(["keyup", "keydown"]).join(" ");
      on.call(e2, e2.media, i, (i2) => {
        let { detail: s = {} } = i2;
        "error" === i2.type && (s = e2.media.error), triggerEvent.call(e2, t.container, i2.type, true, s);
      });
    }), _defineProperty$1(this, "proxy", (e2, t, i) => {
      const { player: s } = this, n = s.config.listeners[i];
      let r = true;
      is.function(n) && (r = n.call(s, e2)), false !== r && is.function(t) && t.call(s, e2);
    }), _defineProperty$1(this, "bind", (e2, t, i, s, n = true) => {
      const { player: r } = this, a = r.config.listeners[s], o = is.function(a);
      on.call(r, e2, t, (e3) => this.proxy(e3, i, s), n && !o);
    }), _defineProperty$1(this, "controls", () => {
      const { player: e2 } = this, { elements: t } = e2, i = browser.isIE ? "change" : "input";
      if (t.buttons.play && Array.from(t.buttons.play).forEach((t2) => {
        this.bind(t2, "click", () => {
          silencePromise(e2.togglePlay());
        }, "play");
      }), this.bind(t.buttons.restart, "click", e2.restart, "restart"), this.bind(t.buttons.rewind, "click", () => {
        e2.lastSeekTime = Date.now(), e2.rewind();
      }, "rewind"), this.bind(t.buttons.fastForward, "click", () => {
        e2.lastSeekTime = Date.now(), e2.forward();
      }, "fastForward"), this.bind(t.buttons.mute, "click", () => {
        e2.muted = !e2.muted;
      }, "mute"), this.bind(t.buttons.captions, "click", () => e2.toggleCaptions()), this.bind(t.buttons.download, "click", () => {
        triggerEvent.call(e2, e2.media, "download");
      }, "download"), this.bind(t.buttons.fullscreen, "click", () => {
        e2.fullscreen.toggle();
      }, "fullscreen"), this.bind(t.buttons.pip, "click", () => {
        e2.pip = "toggle";
      }, "pip"), this.bind(t.buttons.airplay, "click", e2.airplay, "airplay"), this.bind(t.buttons.settings, "click", (t2) => {
        t2.stopPropagation(), t2.preventDefault(), controls.toggleMenu.call(e2, t2);
      }, null, false), this.bind(t.buttons.settings, "keyup", (t2) => {
        ["Space", "Enter"].includes(t2.key) && ("Enter" !== t2.key ? (t2.preventDefault(), t2.stopPropagation(), controls.toggleMenu.call(e2, t2)) : controls.focusFirstMenuItem.call(e2, null, true));
      }, null, false), this.bind(t.settings.menu, "keydown", (t2) => {
        "Escape" === t2.key && controls.toggleMenu.call(e2, t2);
      }), this.bind(t.inputs.seek, "mousedown mousemove", (e3) => {
        const i2 = t.progress.getBoundingClientRect(), s = 100 / i2.width * (e3.pageX - i2.left);
        e3.currentTarget.setAttribute("seek-value", s);
      }), this.bind(t.inputs.seek, "mousedown mouseup keydown keyup touchstart touchend", (t2) => {
        const i2 = t2.currentTarget, s = "play-on-seeked";
        if (is.keyboardEvent(t2) && !["ArrowLeft", "ArrowRight"].includes(t2.key))
          return;
        e2.lastSeekTime = Date.now();
        const n = i2.hasAttribute(s), r = ["mouseup", "touchend", "keyup"].includes(t2.type);
        n && r ? (i2.removeAttribute(s), silencePromise(e2.play())) : !r && e2.playing && (i2.setAttribute(s, ""), e2.pause());
      }), browser.isIos) {
        const t2 = getElements.call(e2, 'input[type="range"]');
        Array.from(t2).forEach((e3) => this.bind(e3, i, (e4) => repaint(e4.target)));
      }
      this.bind(t.inputs.seek, i, (t2) => {
        const i2 = t2.currentTarget;
        let s = i2.getAttribute("seek-value");
        is.empty(s) && (s = i2.value), i2.removeAttribute("seek-value"), e2.currentTime = s / i2.max * e2.duration;
      }, "seek"), this.bind(t.progress, "mouseenter mouseleave mousemove", (t2) => controls.updateSeekTooltip.call(e2, t2)), this.bind(t.progress, "mousemove touchmove", (t2) => {
        const { previewThumbnails: i2 } = e2;
        i2 && i2.loaded && i2.startMove(t2);
      }), this.bind(t.progress, "mouseleave touchend click", () => {
        const { previewThumbnails: t2 } = e2;
        t2 && t2.loaded && t2.endMove(false, true);
      }), this.bind(t.progress, "mousedown touchstart", (t2) => {
        const { previewThumbnails: i2 } = e2;
        i2 && i2.loaded && i2.startScrubbing(t2);
      }), this.bind(t.progress, "mouseup touchend", (t2) => {
        const { previewThumbnails: i2 } = e2;
        i2 && i2.loaded && i2.endScrubbing(t2);
      }), browser.isWebkit && Array.from(getElements.call(e2, 'input[type="range"]')).forEach((t2) => {
        this.bind(t2, "input", (t3) => controls.updateRangeFill.call(e2, t3.target));
      }), e2.config.toggleInvert && !is.element(t.display.duration) && this.bind(t.display.currentTime, "click", () => {
        0 !== e2.currentTime && (e2.config.invertTime = !e2.config.invertTime, controls.timeUpdate.call(e2));
      }), this.bind(t.inputs.volume, i, (t2) => {
        e2.volume = t2.target.value;
      }, "volume"), this.bind(t.controls, "mouseenter mouseleave", (i2) => {
        t.controls.hover = !e2.touch && "mouseenter" === i2.type;
      }), t.fullscreen && Array.from(t.fullscreen.children).filter((e3) => !e3.contains(t.container)).forEach((i2) => {
        this.bind(i2, "mouseenter mouseleave", (i3) => {
          t.controls && (t.controls.hover = !e2.touch && "mouseenter" === i3.type);
        });
      }), this.bind(t.controls, "mousedown mouseup touchstart touchend touchcancel", (e3) => {
        t.controls.pressed = ["mousedown", "touchstart"].includes(e3.type);
      }), this.bind(t.controls, "focusin", () => {
        const { config: i2, timers: s } = e2;
        toggleClass(t.controls, i2.classNames.noTransition, true), ui.toggleControls.call(e2, true), setTimeout(() => {
          toggleClass(t.controls, i2.classNames.noTransition, false);
        }, 0);
        const n = this.touch ? 3e3 : 4e3;
        clearTimeout(s.controls), s.controls = setTimeout(() => ui.toggleControls.call(e2, false), n);
      }), this.bind(t.inputs.volume, "wheel", (t2) => {
        const i2 = t2.webkitDirectionInvertedFromDevice, [s, n] = [t2.deltaX, -t2.deltaY].map((e3) => i2 ? -e3 : e3), r = Math.sign(Math.abs(s) > Math.abs(n) ? s : n);
        e2.increaseVolume(r / 50);
        const { volume: a } = e2.media;
        (1 === r && a < 1 || -1 === r && a > 0) && t2.preventDefault();
      }, "volume", false);
    }), this.player = e, this.lastKey = null, this.focusTimer = null, this.lastKeyDown = null, this.handleKey = this.handleKey.bind(this), this.toggleMenu = this.toggleMenu.bind(this), this.setTabFocus = this.setTabFocus.bind(this), this.firstTouch = this.firstTouch.bind(this);
  }
  handleKey(e) {
    const { player: t } = this, { elements: i } = t, { key: s, type: n, altKey: r, ctrlKey: a, metaKey: o, shiftKey: l } = e, c = "keydown" === n, u = c && s === this.lastKey;
    if (r || a || o || l)
      return;
    if (!s)
      return;
    if (c) {
      const n2 = document.activeElement;
      if (is.element(n2)) {
        const { editable: s2 } = t.config.selectors, { seek: r2 } = i.inputs;
        if (n2 !== r2 && matches(n2, s2))
          return;
        if ("Space" === e.key && matches(n2, 'button, [role^="menuitem"]'))
          return;
      }
      switch (["Space", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "c", "f", "k", "l", "m"].includes(s) && (e.preventDefault(), e.stopPropagation()), s) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          u || (d = parseInt(s, 10), t.currentTime = t.duration / 10 * d);
          break;
        case "Space":
        case "k":
          u || silencePromise(t.togglePlay());
          break;
        case "ArrowUp":
          t.increaseVolume(0.1);
          break;
        case "ArrowDown":
          t.decreaseVolume(0.1);
          break;
        case "m":
          u || (t.muted = !t.muted);
          break;
        case "ArrowRight":
          t.forward();
          break;
        case "ArrowLeft":
          t.rewind();
          break;
        case "f":
          t.fullscreen.toggle();
          break;
        case "c":
          u || t.toggleCaptions();
          break;
        case "l":
          t.loop = !t.loop;
      }
      "Escape" === s && !t.fullscreen.usingNative && t.fullscreen.active && t.fullscreen.toggle(), this.lastKey = s;
    } else
      this.lastKey = null;
    var d;
  }
  toggleMenu(e) {
    controls.toggleMenu.call(this.player, e);
  }
}
function createCommonjsModule(e, t) {
  return e(t = { exports: {} }, t.exports), t.exports;
}
var loadjs_umd = createCommonjsModule(function(e, t) {
  e.exports = function() {
    var e2 = function() {
    }, t2 = {}, i = {}, s = {};
    function n(e3, t3) {
      e3 = e3.push ? e3 : [e3];
      var n2, r2, a2, o2 = [], l2 = e3.length, c2 = l2;
      for (n2 = function(e4, i2) {
        i2.length && o2.push(e4), --c2 || t3(o2);
      }; l2--; )
        r2 = e3[l2], (a2 = i[r2]) ? n2(r2, a2) : (s[r2] = s[r2] || []).push(n2);
    }
    function r(e3, t3) {
      if (e3) {
        var n2 = s[e3];
        if (i[e3] = t3, n2)
          for (; n2.length; )
            n2[0](e3, t3), n2.splice(0, 1);
      }
    }
    function a(t3, i2) {
      t3.call && (t3 = { success: t3 }), i2.length ? (t3.error || e2)(i2) : (t3.success || e2)(t3);
    }
    function o(t3, i2, s2, n2) {
      var r2, a2, l2 = document, c2 = s2.async, u = (s2.numRetries || 0) + 1, d = s2.before || e2, h = t3.replace(/[\?|#].*$/, ""), m = t3.replace(/^(css|img)!/, "");
      n2 = n2 || 0, /(^css!|\.css$)/.test(h) ? ((a2 = l2.createElement("link")).rel = "stylesheet", a2.href = m, (r2 = "hideFocus" in a2) && a2.relList && (r2 = 0, a2.rel = "preload", a2.as = "style")) : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(h) ? (a2 = l2.createElement("img")).src = m : ((a2 = l2.createElement("script")).src = t3, a2.async = void 0 === c2 || c2), a2.onload = a2.onerror = a2.onbeforeload = function(e3) {
        var l3 = e3.type[0];
        if (r2)
          try {
            a2.sheet.cssText.length || (l3 = "e");
          } catch (e4) {
            18 != e4.code && (l3 = "e");
          }
        if ("e" == l3) {
          if ((n2 += 1) < u)
            return o(t3, i2, s2, n2);
        } else if ("preload" == a2.rel && "style" == a2.as)
          return a2.rel = "stylesheet";
        i2(t3, l3, e3.defaultPrevented);
      }, false !== d(t3, a2) && l2.head.appendChild(a2);
    }
    function l(e3, t3, i2) {
      var s2, n2, r2 = (e3 = e3.push ? e3 : [e3]).length, a2 = r2, l2 = [];
      for (s2 = function(e4, i3, s3) {
        if ("e" == i3 && l2.push(e4), "b" == i3) {
          if (!s3)
            return;
          l2.push(e4);
        }
        --r2 || t3(l2);
      }, n2 = 0; n2 < a2; n2++)
        o(e3[n2], s2, i2);
    }
    function c(e3, i2, s2) {
      var n2, o2;
      if (i2 && i2.trim && (n2 = i2), o2 = (n2 ? s2 : i2) || {}, n2) {
        if (n2 in t2)
          throw "LoadJS";
        t2[n2] = true;
      }
      function c2(t3, i3) {
        l(e3, function(e4) {
          a(o2, e4), t3 && a({ success: t3, error: i3 }, e4), r(n2, e4);
        }, o2);
      }
      if (o2.returnPromise)
        return new Promise(c2);
      c2();
    }
    return c.ready = function(e3, t3) {
      return n(e3, function(e4) {
        a(t3, e4);
      }), c;
    }, c.done = function(e3) {
      r(e3, []);
    }, c.reset = function() {
      t2 = {}, i = {}, s = {};
    }, c.isDefined = function(e3) {
      return e3 in t2;
    }, c;
  }();
});
function loadScript(e) {
  return new Promise((t, i) => {
    loadjs_umd(e, { success: t, error: i });
  });
}
function parseId$1(e) {
  if (is.empty(e))
    return null;
  if (is.number(Number(e)))
    return e;
  return e.match(/^.*(vimeo.com\/|video\/)(\d+).*/) ? RegExp.$2 : e;
}
function parseHash(e) {
  const t = e.match(/^.*(vimeo.com\/|video\/)(\d+)(\?.*&*h=|\/)+([\d,a-f]+)/);
  return t && 5 === t.length ? t[4] : null;
}
function assurePlaybackState$1(e) {
  e && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e && (this.media.paused = !e, triggerEvent.call(this, this.media, e ? "play" : "pause"));
}
const vimeo = { setup() {
  const e = this;
  toggleClass(e.elements.wrapper, e.config.classNames.embed, true), e.options.speed = e.config.speed.options, setAspectRatio.call(e), is.object(window.Vimeo) ? vimeo.ready.call(e) : loadScript(e.config.urls.vimeo.sdk).then(() => {
    vimeo.ready.call(e);
  }).catch((t) => {
    e.debug.warn("Vimeo SDK (player.js) failed to load", t);
  });
}, ready() {
  const e = this, t = e.config.vimeo, { premium: i, referrerPolicy: s, ...n } = t;
  let r = e.media.getAttribute("src"), a = "";
  is.empty(r) ? (r = e.media.getAttribute(e.config.attributes.embed.id), a = e.media.getAttribute(e.config.attributes.embed.hash)) : a = parseHash(r);
  const o = a ? { h: a } : {};
  i && Object.assign(n, { controls: false, sidedock: false });
  const l = buildUrlParams({ loop: e.config.loop.active, autoplay: e.autoplay, muted: e.muted, gesture: "media", playsinline: !this.config.fullscreen.iosNative, ...o, ...n }), c = parseId$1(r), u = createElement("iframe"), d = format(e.config.urls.vimeo.iframe, c, l);
  if (u.setAttribute("src", d), u.setAttribute("allowfullscreen", ""), u.setAttribute("allow", ["autoplay", "fullscreen", "picture-in-picture", "encrypted-media", "accelerometer", "gyroscope"].join("; ")), is.empty(s) || u.setAttribute("referrerPolicy", s), i || !t.customControls)
    u.setAttribute("data-poster", e.poster), e.media = replaceElement(u, e.media);
  else {
    const t2 = createElement("div", { class: e.config.classNames.embedContainer, "data-poster": e.poster });
    t2.appendChild(u), e.media = replaceElement(t2, e.media);
  }
  t.customControls || fetch(format(e.config.urls.vimeo.api, d)).then((t2) => {
    !is.empty(t2) && t2.thumbnail_url && ui.setPoster.call(e, t2.thumbnail_url).catch(() => {
    });
  }), e.embed = new window.Vimeo.Player(u, { autopause: e.config.autopause, muted: e.muted }), e.media.paused = true, e.media.currentTime = 0, e.supported.ui && e.embed.disableTextTrack(), e.media.play = () => (assurePlaybackState$1.call(e, true), e.embed.play()), e.media.pause = () => (assurePlaybackState$1.call(e, false), e.embed.pause()), e.media.stop = () => {
    e.pause(), e.currentTime = 0;
  };
  let { currentTime: h } = e.media;
  Object.defineProperty(e.media, "currentTime", { get: () => h, set(t2) {
    const { embed: i2, media: s2, paused: n2, volume: r2 } = e, a2 = n2 && !i2.hasPlayed;
    s2.seeking = true, triggerEvent.call(e, s2, "seeking"), Promise.resolve(a2 && i2.setVolume(0)).then(() => i2.setCurrentTime(t2)).then(() => a2 && i2.pause()).then(() => a2 && i2.setVolume(r2)).catch(() => {
    });
  } });
  let m = e.config.speed.selected;
  Object.defineProperty(e.media, "playbackRate", { get: () => m, set(t2) {
    e.embed.setPlaybackRate(t2).then(() => {
      m = t2, triggerEvent.call(e, e.media, "ratechange");
    }).catch(() => {
      e.options.speed = [1];
    });
  } });
  let { volume: p } = e.config;
  Object.defineProperty(e.media, "volume", { get: () => p, set(t2) {
    e.embed.setVolume(t2).then(() => {
      p = t2, triggerEvent.call(e, e.media, "volumechange");
    });
  } });
  let { muted: g } = e.config;
  Object.defineProperty(e.media, "muted", { get: () => g, set(t2) {
    const i2 = !!is.boolean(t2) && t2;
    e.embed.setVolume(i2 ? 0 : e.config.volume).then(() => {
      g = i2, triggerEvent.call(e, e.media, "volumechange");
    });
  } });
  let f, { loop: y } = e.config;
  Object.defineProperty(e.media, "loop", { get: () => y, set(t2) {
    const i2 = is.boolean(t2) ? t2 : e.config.loop.active;
    e.embed.setLoop(i2).then(() => {
      y = i2;
    });
  } }), e.embed.getVideoUrl().then((t2) => {
    f = t2, controls.setDownloadUrl.call(e);
  }).catch((e2) => {
    this.debug.warn(e2);
  }), Object.defineProperty(e.media, "currentSrc", { get: () => f }), Object.defineProperty(e.media, "ended", { get: () => e.currentTime === e.duration }), Promise.all([e.embed.getVideoWidth(), e.embed.getVideoHeight()]).then((t2) => {
    const [i2, s2] = t2;
    e.embed.ratio = roundAspectRatio(i2, s2), setAspectRatio.call(this);
  }), e.embed.setAutopause(e.config.autopause).then((t2) => {
    e.config.autopause = t2;
  }), e.embed.getVideoTitle().then((t2) => {
    e.config.title = t2, ui.setTitle.call(this);
  }), e.embed.getCurrentTime().then((t2) => {
    h = t2, triggerEvent.call(e, e.media, "timeupdate");
  }), e.embed.getDuration().then((t2) => {
    e.media.duration = t2, triggerEvent.call(e, e.media, "durationchange");
  }), e.embed.getTextTracks().then((t2) => {
    e.media.textTracks = t2, captions.setup.call(e);
  }), e.embed.on("cuechange", ({ cues: t2 = [] }) => {
    const i2 = t2.map((e2) => stripHTML(e2.text));
    captions.updateCues.call(e, i2);
  }), e.embed.on("loaded", () => {
    if (e.embed.getPaused().then((t2) => {
      assurePlaybackState$1.call(e, !t2), t2 || triggerEvent.call(e, e.media, "playing");
    }), is.element(e.embed.element) && e.supported.ui) {
      e.embed.element.setAttribute("tabindex", -1);
    }
  }), e.embed.on("bufferstart", () => {
    triggerEvent.call(e, e.media, "waiting");
  }), e.embed.on("bufferend", () => {
    triggerEvent.call(e, e.media, "playing");
  }), e.embed.on("play", () => {
    assurePlaybackState$1.call(e, true), triggerEvent.call(e, e.media, "playing");
  }), e.embed.on("pause", () => {
    assurePlaybackState$1.call(e, false);
  }), e.embed.on("timeupdate", (t2) => {
    e.media.seeking = false, h = t2.seconds, triggerEvent.call(e, e.media, "timeupdate");
  }), e.embed.on("progress", (t2) => {
    e.media.buffered = t2.percent, triggerEvent.call(e, e.media, "progress"), 1 === parseInt(t2.percent, 10) && triggerEvent.call(e, e.media, "canplaythrough"), e.embed.getDuration().then((t3) => {
      t3 !== e.media.duration && (e.media.duration = t3, triggerEvent.call(e, e.media, "durationchange"));
    });
  }), e.embed.on("seeked", () => {
    e.media.seeking = false, triggerEvent.call(e, e.media, "seeked");
  }), e.embed.on("ended", () => {
    e.media.paused = true, triggerEvent.call(e, e.media, "ended");
  }), e.embed.on("error", (t2) => {
    e.media.error = t2, triggerEvent.call(e, e.media, "error");
  }), t.customControls && setTimeout(() => ui.build.call(e), 0);
} };
function parseId(e) {
  if (is.empty(e))
    return null;
  return e.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/) ? RegExp.$2 : e;
}
function assurePlaybackState(e) {
  e && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e && (this.media.paused = !e, triggerEvent.call(this, this.media, e ? "play" : "pause"));
}
function getHost(e) {
  return e.noCookie ? "https://www.youtube-nocookie.com" : "http:" === window.location.protocol ? "http://www.youtube.com" : void 0;
}
const youtube = { setup() {
  if (toggleClass(this.elements.wrapper, this.config.classNames.embed, true), is.object(window.YT) && is.function(window.YT.Player))
    youtube.ready.call(this);
  else {
    const e = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      is.function(e) && e(), youtube.ready.call(this);
    }, loadScript(this.config.urls.youtube.sdk).catch((e2) => {
      this.debug.warn("YouTube API failed to load", e2);
    });
  }
}, getTitle(e) {
  fetch(format(this.config.urls.youtube.api, e)).then((e2) => {
    if (is.object(e2)) {
      const { title: t, height: i, width: s } = e2;
      this.config.title = t, ui.setTitle.call(this), this.embed.ratio = roundAspectRatio(s, i);
    }
    setAspectRatio.call(this);
  }).catch(() => {
    setAspectRatio.call(this);
  });
}, ready() {
  const e = this, t = e.config.youtube, i = e.media && e.media.getAttribute("id");
  if (!is.empty(i) && i.startsWith("youtube-"))
    return;
  let s = e.media.getAttribute("src");
  is.empty(s) && (s = e.media.getAttribute(this.config.attributes.embed.id));
  const n = parseId(s), r = createElement("div", { id: generateId(e.provider), "data-poster": t.customControls ? e.poster : void 0 });
  if (e.media = replaceElement(r, e.media), t.customControls) {
    const t2 = (e2) => `https://i.ytimg.com/vi/${n}/${e2}default.jpg`;
    loadImage(t2("maxres"), 121).catch(() => loadImage(t2("sd"), 121)).catch(() => loadImage(t2("hq"))).then((t3) => ui.setPoster.call(e, t3.src)).then((t3) => {
      t3.includes("maxres") || (e.elements.poster.style.backgroundSize = "cover");
    }).catch(() => {
    });
  }
  e.embed = new window.YT.Player(e.media, { videoId: n, host: getHost(t), playerVars: extend({}, { autoplay: e.config.autoplay ? 1 : 0, hl: e.config.hl, controls: e.supported.ui && t.customControls ? 0 : 1, disablekb: 1, playsinline: e.config.fullscreen.iosNative ? 0 : 1, cc_load_policy: e.captions.active ? 1 : 0, cc_lang_pref: e.config.captions.language, widget_referrer: window ? window.location.href : null }, t), events: { onError(t2) {
    if (!e.media.error) {
      const i2 = t2.data, s2 = { 2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.", 5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.", 100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.", 101: "The owner of the requested video does not allow it to be played in embedded players.", 150: "The owner of the requested video does not allow it to be played in embedded players." }[i2] || "An unknown error occured";
      e.media.error = { code: i2, message: s2 }, triggerEvent.call(e, e.media, "error");
    }
  }, onPlaybackRateChange(t2) {
    const i2 = t2.target;
    e.media.playbackRate = i2.getPlaybackRate(), triggerEvent.call(e, e.media, "ratechange");
  }, onReady(i2) {
    if (is.function(e.media.play))
      return;
    const s2 = i2.target;
    youtube.getTitle.call(e, n), e.media.play = () => {
      assurePlaybackState.call(e, true), s2.playVideo();
    }, e.media.pause = () => {
      assurePlaybackState.call(e, false), s2.pauseVideo();
    }, e.media.stop = () => {
      s2.stopVideo();
    }, e.media.duration = s2.getDuration(), e.media.paused = true, e.media.currentTime = 0, Object.defineProperty(e.media, "currentTime", { get: () => Number(s2.getCurrentTime()), set(t2) {
      e.paused && !e.embed.hasPlayed && e.embed.mute(), e.media.seeking = true, triggerEvent.call(e, e.media, "seeking"), s2.seekTo(t2);
    } }), Object.defineProperty(e.media, "playbackRate", { get: () => s2.getPlaybackRate(), set(e2) {
      s2.setPlaybackRate(e2);
    } });
    let { volume: r2 } = e.config;
    Object.defineProperty(e.media, "volume", { get: () => r2, set(t2) {
      r2 = t2, s2.setVolume(100 * r2), triggerEvent.call(e, e.media, "volumechange");
    } });
    let { muted: a } = e.config;
    Object.defineProperty(e.media, "muted", { get: () => a, set(t2) {
      const i3 = is.boolean(t2) ? t2 : a;
      a = i3, s2[i3 ? "mute" : "unMute"](), s2.setVolume(100 * r2), triggerEvent.call(e, e.media, "volumechange");
    } }), Object.defineProperty(e.media, "currentSrc", { get: () => s2.getVideoUrl() }), Object.defineProperty(e.media, "ended", { get: () => e.currentTime === e.duration });
    const o = s2.getAvailablePlaybackRates();
    e.options.speed = o.filter((t2) => e.config.speed.options.includes(t2)), e.supported.ui && t.customControls && e.media.setAttribute("tabindex", -1), triggerEvent.call(e, e.media, "timeupdate"), triggerEvent.call(e, e.media, "durationchange"), clearInterval(e.timers.buffering), e.timers.buffering = setInterval(() => {
      e.media.buffered = s2.getVideoLoadedFraction(), (null === e.media.lastBuffered || e.media.lastBuffered < e.media.buffered) && triggerEvent.call(e, e.media, "progress"), e.media.lastBuffered = e.media.buffered, 1 === e.media.buffered && (clearInterval(e.timers.buffering), triggerEvent.call(e, e.media, "canplaythrough"));
    }, 200), t.customControls && setTimeout(() => ui.build.call(e), 50);
  }, onStateChange(i2) {
    const s2 = i2.target;
    clearInterval(e.timers.playing);
    switch (e.media.seeking && [1, 2].includes(i2.data) && (e.media.seeking = false, triggerEvent.call(e, e.media, "seeked")), i2.data) {
      case -1:
        triggerEvent.call(e, e.media, "timeupdate"), e.media.buffered = s2.getVideoLoadedFraction(), triggerEvent.call(e, e.media, "progress");
        break;
      case 0:
        assurePlaybackState.call(e, false), e.media.loop ? (s2.stopVideo(), s2.playVideo()) : triggerEvent.call(e, e.media, "ended");
        break;
      case 1:
        t.customControls && !e.config.autoplay && e.media.paused && !e.embed.hasPlayed ? e.media.pause() : (assurePlaybackState.call(e, true), triggerEvent.call(e, e.media, "playing"), e.timers.playing = setInterval(() => {
          triggerEvent.call(e, e.media, "timeupdate");
        }, 50), e.media.duration !== s2.getDuration() && (e.media.duration = s2.getDuration(), triggerEvent.call(e, e.media, "durationchange")));
        break;
      case 2:
        e.muted || e.embed.unMute(), assurePlaybackState.call(e, false);
        break;
      case 3:
        triggerEvent.call(e, e.media, "waiting");
    }
    triggerEvent.call(e, e.elements.container, "statechange", false, { code: i2.data });
  } } });
} }, media = { setup() {
  this.media ? (toggleClass(this.elements.container, this.config.classNames.type.replace("{0}", this.type), true), toggleClass(this.elements.container, this.config.classNames.provider.replace("{0}", this.provider), true), this.isEmbed && toggleClass(this.elements.container, this.config.classNames.type.replace("{0}", "video"), true), this.isVideo && (this.elements.wrapper = createElement("div", { class: this.config.classNames.video }), wrap(this.media, this.elements.wrapper), this.elements.poster = createElement("div", { class: this.config.classNames.poster }), this.elements.wrapper.appendChild(this.elements.poster)), this.isHTML5 ? html5.setup.call(this) : this.isYouTube ? youtube.setup.call(this) : this.isVimeo && vimeo.setup.call(this)) : this.debug.warn("No media element found!");
} };
class Ads {
  constructor(e) {
    _defineProperty$1(this, "load", () => {
      this.enabled && (is.object(window.google) && is.object(window.google.ima) ? this.ready() : loadScript(this.player.config.urls.googleIMA.sdk).then(() => {
        this.ready();
      }).catch(() => {
        this.trigger("error", new Error("Google IMA SDK failed to load"));
      }));
    }), _defineProperty$1(this, "ready", () => {
      var e2;
      this.enabled || ((e2 = this).manager && e2.manager.destroy(), e2.elements.displayContainer && e2.elements.displayContainer.destroy(), e2.elements.container.remove()), this.startSafetyTimer(12e3, "ready()"), this.managerPromise.then(() => {
        this.clearSafetyTimer("onAdsManagerLoaded()");
      }), this.listeners(), this.setupIMA();
    }), _defineProperty$1(this, "setupIMA", () => {
      this.elements.container = createElement("div", { class: this.player.config.classNames.ads }), this.player.elements.container.appendChild(this.elements.container), google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), google.ima.settings.setLocale(this.player.config.ads.language), google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline), this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container, this.player.media), this.loader = new google.ima.AdsLoader(this.elements.displayContainer), this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (e2) => this.onAdsManagerLoaded(e2), false), this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e2) => this.onAdError(e2), false), this.requestAds();
    }), _defineProperty$1(this, "requestAds", () => {
      const { container: e2 } = this.player.elements;
      try {
        const t = new google.ima.AdsRequest();
        t.adTagUrl = this.tagUrl, t.linearAdSlotWidth = e2.offsetWidth, t.linearAdSlotHeight = e2.offsetHeight, t.nonLinearAdSlotWidth = e2.offsetWidth, t.nonLinearAdSlotHeight = e2.offsetHeight, t.forceNonLinearFullSlot = false, t.setAdWillPlayMuted(!this.player.muted), this.loader.requestAds(t);
      } catch (e3) {
        this.onAdError(e3);
      }
    }), _defineProperty$1(this, "pollCountdown", (e2 = false) => {
      if (!e2)
        return clearInterval(this.countdownTimer), void this.elements.container.removeAttribute("data-badge-text");
      this.countdownTimer = setInterval(() => {
        const e3 = formatTime(Math.max(this.manager.getRemainingTime(), 0)), t = `${i18n.get("advertisement", this.player.config)} - ${e3}`;
        this.elements.container.setAttribute("data-badge-text", t);
      }, 100);
    }), _defineProperty$1(this, "onAdsManagerLoaded", (e2) => {
      if (!this.enabled)
        return;
      const t = new google.ima.AdsRenderingSettings();
      t.restoreCustomPlaybackStateOnAdBreakComplete = true, t.enablePreloading = true, this.manager = e2.getAdsManager(this.player, t), this.cuePoints = this.manager.getCuePoints(), this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e3) => this.onAdError(e3)), Object.keys(google.ima.AdEvent.Type).forEach((e3) => {
        this.manager.addEventListener(google.ima.AdEvent.Type[e3], (e4) => this.onAdEvent(e4));
      }), this.trigger("loaded");
    }), _defineProperty$1(this, "addCuePoints", () => {
      is.empty(this.cuePoints) || this.cuePoints.forEach((e2) => {
        if (0 !== e2 && -1 !== e2 && e2 < this.player.duration) {
          const t = this.player.elements.progress;
          if (is.element(t)) {
            const i = 100 / this.player.duration * e2, s = createElement("span", { class: this.player.config.classNames.cues });
            s.style.left = `${i.toString()}%`, t.appendChild(s);
          }
        }
      });
    }), _defineProperty$1(this, "onAdEvent", (e2) => {
      const { container: t } = this.player.elements, i = e2.getAd(), s = e2.getAdData();
      switch (((e3) => {
        triggerEvent.call(this.player, this.player.media, `ads${e3.replace(/_/g, "").toLowerCase()}`);
      })(e2.type), e2.type) {
        case google.ima.AdEvent.Type.LOADED:
          this.trigger("loaded"), this.pollCountdown(true), i.isLinear() || (i.width = t.offsetWidth, i.height = t.offsetHeight);
          break;
        case google.ima.AdEvent.Type.STARTED:
          this.manager.setVolume(this.player.volume);
          break;
        case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
          this.player.ended ? this.loadAds() : this.loader.contentComplete();
          break;
        case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
          this.pauseContent();
          break;
        case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
          this.pollCountdown(), this.resumeContent();
          break;
        case google.ima.AdEvent.Type.LOG:
          s.adError && this.player.debug.warn(`Non-fatal ad error: ${s.adError.getMessage()}`);
      }
    }), _defineProperty$1(this, "onAdError", (e2) => {
      this.cancel(), this.player.debug.warn("Ads error", e2);
    }), _defineProperty$1(this, "listeners", () => {
      const { container: e2 } = this.player.elements;
      let t;
      this.player.on("canplay", () => {
        this.addCuePoints();
      }), this.player.on("ended", () => {
        this.loader.contentComplete();
      }), this.player.on("timeupdate", () => {
        t = this.player.currentTime;
      }), this.player.on("seeked", () => {
        const e3 = this.player.currentTime;
        is.empty(this.cuePoints) || this.cuePoints.forEach((i, s) => {
          t < i && i < e3 && (this.manager.discardAdBreak(), this.cuePoints.splice(s, 1));
        });
      }), window.addEventListener("resize", () => {
        this.manager && this.manager.resize(e2.offsetWidth, e2.offsetHeight, google.ima.ViewMode.NORMAL);
      });
    }), _defineProperty$1(this, "play", () => {
      const { container: e2 } = this.player.elements;
      this.managerPromise || this.resumeContent(), this.managerPromise.then(() => {
        this.manager.setVolume(this.player.volume), this.elements.displayContainer.initialize();
        try {
          this.initialized || (this.manager.init(e2.offsetWidth, e2.offsetHeight, google.ima.ViewMode.NORMAL), this.manager.start()), this.initialized = true;
        } catch (e3) {
          this.onAdError(e3);
        }
      }).catch(() => {
      });
    }), _defineProperty$1(this, "resumeContent", () => {
      this.elements.container.style.zIndex = "", this.playing = false, silencePromise(this.player.media.play());
    }), _defineProperty$1(this, "pauseContent", () => {
      this.elements.container.style.zIndex = 3, this.playing = true, this.player.media.pause();
    }), _defineProperty$1(this, "cancel", () => {
      this.initialized && this.resumeContent(), this.trigger("error"), this.loadAds();
    }), _defineProperty$1(this, "loadAds", () => {
      this.managerPromise.then(() => {
        this.manager && this.manager.destroy(), this.managerPromise = new Promise((e2) => {
          this.on("loaded", e2), this.player.debug.log(this.manager);
        }), this.initialized = false, this.requestAds();
      }).catch(() => {
      });
    }), _defineProperty$1(this, "trigger", (e2, ...t) => {
      const i = this.events[e2];
      is.array(i) && i.forEach((e3) => {
        is.function(e3) && e3.apply(this, t);
      });
    }), _defineProperty$1(this, "on", (e2, t) => (is.array(this.events[e2]) || (this.events[e2] = []), this.events[e2].push(t), this)), _defineProperty$1(this, "startSafetyTimer", (e2, t) => {
      this.player.debug.log(`Safety timer invoked from: ${t}`), this.safetyTimer = setTimeout(() => {
        this.cancel(), this.clearSafetyTimer("startSafetyTimer()");
      }, e2);
    }), _defineProperty$1(this, "clearSafetyTimer", (e2) => {
      is.nullOrUndefined(this.safetyTimer) || (this.player.debug.log(`Safety timer cleared from: ${e2}`), clearTimeout(this.safetyTimer), this.safetyTimer = null);
    }), this.player = e, this.config = e.config.ads, this.playing = false, this.initialized = false, this.elements = { container: null, displayContainer: null }, this.manager = null, this.loader = null, this.cuePoints = null, this.events = {}, this.safetyTimer = null, this.countdownTimer = null, this.managerPromise = new Promise((e2, t) => {
      this.on("loaded", e2), this.on("error", t);
    }), this.load();
  }
  get enabled() {
    const { config: e } = this;
    return this.player.isHTML5 && this.player.isVideo && e.enabled && (!is.empty(e.publisherId) || is.url(e.tagUrl));
  }
  get tagUrl() {
    const { config: e } = this;
    if (is.url(e.tagUrl))
      return e.tagUrl;
    return `https://go.aniview.com/api/adserver6/vast/?${buildUrlParams({ AV_PUBLISHERID: "58c25bb0073ef448b1087ad6", AV_CHANNELID: "5a0458dc28a06145e4519d21", AV_URL: window.location.hostname, cb: Date.now(), AV_WIDTH: 640, AV_HEIGHT: 480, AV_CDIM2: e.publisherId })}`;
  }
}
function clamp(e = 0, t = 0, i = 255) {
  return Math.min(Math.max(e, t), i);
}
const parseVtt = (e) => {
  const t = [];
  return e.split(/\r\n\r\n|\n\n|\r\r/).forEach((e2) => {
    const i = {};
    e2.split(/\r\n|\n|\r/).forEach((e3) => {
      if (is.number(i.startTime)) {
        if (!is.empty(e3.trim()) && is.empty(i.text)) {
          const t2 = e3.trim().split("#xywh=");
          [i.text] = t2, t2[1] && ([i.x, i.y, i.w, i.h] = t2[1].split(","));
        }
      } else {
        const t2 = e3.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/);
        t2 && (i.startTime = 60 * Number(t2[1] || 0) * 60 + 60 * Number(t2[2]) + Number(t2[3]) + Number(`0.${t2[4]}`), i.endTime = 60 * Number(t2[6] || 0) * 60 + 60 * Number(t2[7]) + Number(t2[8]) + Number(`0.${t2[9]}`));
      }
    }), i.text && t.push(i);
  }), t;
}, fitRatio = (e, t) => {
  const i = {};
  return e > t.width / t.height ? (i.width = t.width, i.height = 1 / e * t.width) : (i.height = t.height, i.width = e * t.height), i;
};
class PreviewThumbnails {
  constructor(e) {
    _defineProperty$1(this, "load", () => {
      this.player.elements.display.seekTooltip && (this.player.elements.display.seekTooltip.hidden = this.enabled), this.enabled && this.getThumbnails().then(() => {
        this.enabled && (this.render(), this.determineContainerAutoSizing(), this.loaded = true);
      });
    }), _defineProperty$1(this, "getThumbnails", () => new Promise((e2) => {
      const { src: t } = this.player.config.previewThumbnails;
      if (is.empty(t))
        throw new Error("Missing previewThumbnails.src config attribute");
      const i = () => {
        this.thumbnails.sort((e3, t2) => e3.height - t2.height), this.player.debug.log("Preview thumbnails", this.thumbnails), e2();
      };
      if (is.function(t))
        t((e3) => {
          this.thumbnails = e3, i();
        });
      else {
        const e3 = (is.string(t) ? [t] : t).map((e4) => this.getThumbnail(e4));
        Promise.all(e3).then(i);
      }
    })), _defineProperty$1(this, "getThumbnail", (e2) => new Promise((t) => {
      fetch(e2).then((i) => {
        const s = { frames: parseVtt(i), height: null, urlPrefix: "" };
        s.frames[0].text.startsWith("/") || s.frames[0].text.startsWith("http://") || s.frames[0].text.startsWith("https://") || (s.urlPrefix = e2.substring(0, e2.lastIndexOf("/") + 1));
        const n = new Image();
        n.onload = () => {
          s.height = n.naturalHeight, s.width = n.naturalWidth, this.thumbnails.push(s), t();
        }, n.src = s.urlPrefix + s.frames[0].text;
      });
    })), _defineProperty$1(this, "startMove", (e2) => {
      if (this.loaded && is.event(e2) && ["touchmove", "mousemove"].includes(e2.type) && this.player.media.duration) {
        if ("touchmove" === e2.type)
          this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
        else {
          var t, i;
          const s = this.player.elements.progress.getBoundingClientRect(), n = 100 / s.width * (e2.pageX - s.left);
          this.seekTime = this.player.media.duration * (n / 100), this.seekTime < 0 && (this.seekTime = 0), this.seekTime > this.player.media.duration - 1 && (this.seekTime = this.player.media.duration - 1), this.mousePosX = e2.pageX, this.elements.thumb.time.innerText = formatTime(this.seekTime);
          const r = null === (t = this.player.config.markers) || void 0 === t || null === (i = t.points) || void 0 === i ? void 0 : i.find(({ time: e3 }) => e3 === Math.round(this.seekTime));
          r && this.elements.thumb.time.insertAdjacentHTML("afterbegin", `${r.label}<br>`);
        }
        this.showImageAtCurrentTime();
      }
    }), _defineProperty$1(this, "endMove", () => {
      this.toggleThumbContainer(false, true);
    }), _defineProperty$1(this, "startScrubbing", (e2) => {
      (is.nullOrUndefined(e2.button) || false === e2.button || 0 === e2.button) && (this.mouseDown = true, this.player.media.duration && (this.toggleScrubbingContainer(true), this.toggleThumbContainer(false, true), this.showImageAtCurrentTime()));
    }), _defineProperty$1(this, "endScrubbing", () => {
      this.mouseDown = false, Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime) ? this.toggleScrubbingContainer(false) : once.call(this.player, this.player.media, "timeupdate", () => {
        this.mouseDown || this.toggleScrubbingContainer(false);
      });
    }), _defineProperty$1(this, "listeners", () => {
      this.player.on("play", () => {
        this.toggleThumbContainer(false, true);
      }), this.player.on("seeked", () => {
        this.toggleThumbContainer(false);
      }), this.player.on("timeupdate", () => {
        this.lastTime = this.player.media.currentTime;
      });
    }), _defineProperty$1(this, "render", () => {
      this.elements.thumb.container = createElement("div", { class: this.player.config.classNames.previewThumbnails.thumbContainer }), this.elements.thumb.imageContainer = createElement("div", { class: this.player.config.classNames.previewThumbnails.imageContainer }), this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer);
      const e2 = createElement("div", { class: this.player.config.classNames.previewThumbnails.timeContainer });
      this.elements.thumb.time = createElement("span", {}, "00:00"), e2.appendChild(this.elements.thumb.time), this.elements.thumb.imageContainer.appendChild(e2), is.element(this.player.elements.progress) && this.player.elements.progress.appendChild(this.elements.thumb.container), this.elements.scrubbing.container = createElement("div", { class: this.player.config.classNames.previewThumbnails.scrubbingContainer }), this.player.elements.wrapper.appendChild(this.elements.scrubbing.container);
    }), _defineProperty$1(this, "destroy", () => {
      this.elements.thumb.container && this.elements.thumb.container.remove(), this.elements.scrubbing.container && this.elements.scrubbing.container.remove();
    }), _defineProperty$1(this, "showImageAtCurrentTime", () => {
      this.mouseDown ? this.setScrubbingContainerSize() : this.setThumbContainerSizeAndPos();
      const e2 = this.thumbnails[0].frames.findIndex((e3) => this.seekTime >= e3.startTime && this.seekTime <= e3.endTime), t = e2 >= 0;
      let i = 0;
      this.mouseDown || this.toggleThumbContainer(t), t && (this.thumbnails.forEach((t2, s) => {
        this.loadedImages.includes(t2.frames[e2].text) && (i = s);
      }), e2 !== this.showingThumb && (this.showingThumb = e2, this.loadImage(i)));
    }), _defineProperty$1(this, "loadImage", (e2 = 0) => {
      const t = this.showingThumb, i = this.thumbnails[e2], { urlPrefix: s } = i, n = i.frames[t], r = i.frames[t].text, a = s + r;
      if (this.currentImageElement && this.currentImageElement.dataset.filename === r)
        this.showImage(this.currentImageElement, n, e2, t, r, false), this.currentImageElement.dataset.index = t, this.removeOldImages(this.currentImageElement);
      else {
        this.loadingImage && this.usingSprites && (this.loadingImage.onload = null);
        const i2 = new Image();
        i2.src = a, i2.dataset.index = t, i2.dataset.filename = r, this.showingThumbFilename = r, this.player.debug.log(`Loading image: ${a}`), i2.onload = () => this.showImage(i2, n, e2, t, r, true), this.loadingImage = i2, this.removeOldImages(i2);
      }
    }), _defineProperty$1(this, "showImage", (e2, t, i, s, n, r = true) => {
      this.player.debug.log(`Showing thumb: ${n}. num: ${s}. qual: ${i}. newimg: ${r}`), this.setImageSizeAndOffset(e2, t), r && (this.currentImageContainer.appendChild(e2), this.currentImageElement = e2, this.loadedImages.includes(n) || this.loadedImages.push(n)), this.preloadNearby(s, true).then(this.preloadNearby(s, false)).then(this.getHigherQuality(i, e2, t, n));
    }), _defineProperty$1(this, "removeOldImages", (e2) => {
      Array.from(this.currentImageContainer.children).forEach((t) => {
        if ("img" !== t.tagName.toLowerCase())
          return;
        const i = this.usingSprites ? 500 : 1e3;
        if (t.dataset.index !== e2.dataset.index && !t.dataset.deleting) {
          t.dataset.deleting = true;
          const { currentImageContainer: e3 } = this;
          setTimeout(() => {
            e3.removeChild(t), this.player.debug.log(`Removing thumb: ${t.dataset.filename}`);
          }, i);
        }
      });
    }), _defineProperty$1(this, "preloadNearby", (e2, t = true) => new Promise((i) => {
      setTimeout(() => {
        const s = this.thumbnails[0].frames[e2].text;
        if (this.showingThumbFilename === s) {
          let n;
          n = t ? this.thumbnails[0].frames.slice(e2) : this.thumbnails[0].frames.slice(0, e2).reverse();
          let r = false;
          n.forEach((e3) => {
            const t2 = e3.text;
            if (t2 !== s && !this.loadedImages.includes(t2)) {
              r = true, this.player.debug.log(`Preloading thumb filename: ${t2}`);
              const { urlPrefix: e4 } = this.thumbnails[0], s2 = e4 + t2, n2 = new Image();
              n2.src = s2, n2.onload = () => {
                this.player.debug.log(`Preloaded thumb filename: ${t2}`), this.loadedImages.includes(t2) || this.loadedImages.push(t2), i();
              };
            }
          }), r || i();
        }
      }, 300);
    })), _defineProperty$1(this, "getHigherQuality", (e2, t, i, s) => {
      if (e2 < this.thumbnails.length - 1) {
        let n = t.naturalHeight;
        this.usingSprites && (n = i.h), n < this.thumbContainerHeight && setTimeout(() => {
          this.showingThumbFilename === s && (this.player.debug.log(`Showing higher quality thumb for: ${s}`), this.loadImage(e2 + 1));
        }, 300);
      }
    }), _defineProperty$1(this, "toggleThumbContainer", (e2 = false, t = false) => {
      const i = this.player.config.classNames.previewThumbnails.thumbContainerShown;
      this.elements.thumb.container.classList.toggle(i, e2), !e2 && t && (this.showingThumb = null, this.showingThumbFilename = null);
    }), _defineProperty$1(this, "toggleScrubbingContainer", (e2 = false) => {
      const t = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;
      this.elements.scrubbing.container.classList.toggle(t, e2), e2 || (this.showingThumb = null, this.showingThumbFilename = null);
    }), _defineProperty$1(this, "determineContainerAutoSizing", () => {
      (this.elements.thumb.imageContainer.clientHeight > 20 || this.elements.thumb.imageContainer.clientWidth > 20) && (this.sizeSpecifiedInCSS = true);
    }), _defineProperty$1(this, "setThumbContainerSizeAndPos", () => {
      const { imageContainer: e2 } = this.elements.thumb;
      if (this.sizeSpecifiedInCSS) {
        if (e2.clientHeight > 20 && e2.clientWidth < 20) {
          const t = Math.floor(e2.clientHeight * this.thumbAspectRatio);
          e2.style.width = `${t}px`;
        } else if (e2.clientHeight < 20 && e2.clientWidth > 20) {
          const t = Math.floor(e2.clientWidth / this.thumbAspectRatio);
          e2.style.height = `${t}px`;
        }
      } else {
        const t = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
        e2.style.height = `${this.thumbContainerHeight}px`, e2.style.width = `${t}px`;
      }
      this.setThumbContainerPos();
    }), _defineProperty$1(this, "setThumbContainerPos", () => {
      const e2 = this.player.elements.progress.getBoundingClientRect(), t = this.player.elements.container.getBoundingClientRect(), { container: i } = this.elements.thumb, s = t.left - e2.left + 10, n = t.right - e2.left - i.clientWidth - 10, r = this.mousePosX - e2.left - i.clientWidth / 2, a = clamp(r, s, n);
      i.style.left = `${a}px`, i.style.setProperty("--preview-arrow-offset", r - a + "px");
    }), _defineProperty$1(this, "setScrubbingContainerSize", () => {
      const { width: e2, height: t } = fitRatio(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
      this.elements.scrubbing.container.style.width = `${e2}px`, this.elements.scrubbing.container.style.height = `${t}px`;
    }), _defineProperty$1(this, "setImageSizeAndOffset", (e2, t) => {
      if (!this.usingSprites)
        return;
      const i = this.thumbContainerHeight / t.h;
      e2.style.height = e2.naturalHeight * i + "px", e2.style.width = e2.naturalWidth * i + "px", e2.style.left = `-${t.x * i}px`, e2.style.top = `-${t.y * i}px`;
    }), this.player = e, this.thumbnails = [], this.loaded = false, this.lastMouseMoveTime = Date.now(), this.mouseDown = false, this.loadedImages = [], this.elements = { thumb: {}, scrubbing: {} }, this.load();
  }
  get enabled() {
    return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled;
  }
  get currentImageContainer() {
    return this.mouseDown ? this.elements.scrubbing.container : this.elements.thumb.imageContainer;
  }
  get usingSprites() {
    return Object.keys(this.thumbnails[0].frames[0]).includes("w");
  }
  get thumbAspectRatio() {
    return this.usingSprites ? this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h : this.thumbnails[0].width / this.thumbnails[0].height;
  }
  get thumbContainerHeight() {
    if (this.mouseDown) {
      const { height: e } = fitRatio(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
      return e;
    }
    return this.sizeSpecifiedInCSS ? this.elements.thumb.imageContainer.clientHeight : Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4);
  }
  get currentImageElement() {
    return this.mouseDown ? this.currentScrubbingImageElement : this.currentThumbnailImageElement;
  }
  set currentImageElement(e) {
    this.mouseDown ? this.currentScrubbingImageElement = e : this.currentThumbnailImageElement = e;
  }
}
const source = { insertElements(e, t) {
  is.string(t) ? insertElement(e, this.media, { src: t }) : is.array(t) && t.forEach((t2) => {
    insertElement(e, this.media, t2);
  });
}, change(e) {
  getDeep(e, "sources.length") ? (html5.cancelRequests.call(this), this.destroy.call(this, () => {
    this.options.quality = [], removeElement(this.media), this.media = null, is.element(this.elements.container) && this.elements.container.removeAttribute("class");
    const { sources: t, type: i } = e, [{ provider: s = providers.html5, src: n }] = t, r = "html5" === s ? i : "div", a = "html5" === s ? {} : { src: n };
    Object.assign(this, { provider: s, type: i, supported: support.check(i, s, this.config.playsinline), media: createElement(r, a) }), this.elements.container.appendChild(this.media), is.boolean(e.autoplay) && (this.config.autoplay = e.autoplay), this.isHTML5 && (this.config.crossorigin && this.media.setAttribute("crossorigin", ""), this.config.autoplay && this.media.setAttribute("autoplay", ""), is.empty(e.poster) || (this.poster = e.poster), this.config.loop.active && this.media.setAttribute("loop", ""), this.config.muted && this.media.setAttribute("muted", ""), this.config.playsinline && this.media.setAttribute("playsinline", "")), ui.addStyleHook.call(this), this.isHTML5 && source.insertElements.call(this, "source", t), this.config.title = e.title, media.setup.call(this), this.isHTML5 && Object.keys(e).includes("tracks") && source.insertElements.call(this, "track", e.tracks), (this.isHTML5 || this.isEmbed && !this.supported.ui) && ui.build.call(this), this.isHTML5 && this.media.load(), is.empty(e.previewThumbnails) || (Object.assign(this.config.previewThumbnails, e.previewThumbnails), this.previewThumbnails && this.previewThumbnails.loaded && (this.previewThumbnails.destroy(), this.previewThumbnails = null), this.config.previewThumbnails.enabled && (this.previewThumbnails = new PreviewThumbnails(this))), this.fullscreen.update();
  }, true)) : this.debug.warn("Invalid source format");
} };
class Plyr {
  constructor(e, t) {
    if (_defineProperty$1(this, "play", () => is.function(this.media.play) ? (this.ads && this.ads.enabled && this.ads.managerPromise.then(() => this.ads.play()).catch(() => silencePromise(this.media.play())), this.media.play()) : null), _defineProperty$1(this, "pause", () => this.playing && is.function(this.media.pause) ? this.media.pause() : null), _defineProperty$1(this, "togglePlay", (e2) => (is.boolean(e2) ? e2 : !this.playing) ? this.play() : this.pause()), _defineProperty$1(this, "stop", () => {
      this.isHTML5 ? (this.pause(), this.restart()) : is.function(this.media.stop) && this.media.stop();
    }), _defineProperty$1(this, "restart", () => {
      this.currentTime = 0;
    }), _defineProperty$1(this, "rewind", (e2) => {
      this.currentTime -= is.number(e2) ? e2 : this.config.seekTime;
    }), _defineProperty$1(this, "forward", (e2) => {
      this.currentTime += is.number(e2) ? e2 : this.config.seekTime;
    }), _defineProperty$1(this, "increaseVolume", (e2) => {
      const t2 = this.media.muted ? 0 : this.volume;
      this.volume = t2 + (is.number(e2) ? e2 : 0);
    }), _defineProperty$1(this, "decreaseVolume", (e2) => {
      this.increaseVolume(-e2);
    }), _defineProperty$1(this, "airplay", () => {
      support.airplay && this.media.webkitShowPlaybackTargetPicker();
    }), _defineProperty$1(this, "toggleControls", (e2) => {
      if (this.supported.ui && !this.isAudio) {
        const t2 = hasClass(this.elements.container, this.config.classNames.hideControls), i2 = void 0 === e2 ? void 0 : !e2, s2 = toggleClass(this.elements.container, this.config.classNames.hideControls, i2);
        if (s2 && is.array(this.config.controls) && this.config.controls.includes("settings") && !is.empty(this.config.settings) && controls.toggleMenu.call(this, false), s2 !== t2) {
          const e3 = s2 ? "controlshidden" : "controlsshown";
          triggerEvent.call(this, this.media, e3);
        }
        return !s2;
      }
      return false;
    }), _defineProperty$1(this, "on", (e2, t2) => {
      on.call(this, this.elements.container, e2, t2);
    }), _defineProperty$1(this, "once", (e2, t2) => {
      once.call(this, this.elements.container, e2, t2);
    }), _defineProperty$1(this, "off", (e2, t2) => {
      off(this.elements.container, e2, t2);
    }), _defineProperty$1(this, "destroy", (e2, t2 = false) => {
      if (!this.ready)
        return;
      const i2 = () => {
        document.body.style.overflow = "", this.embed = null, t2 ? (Object.keys(this.elements).length && (removeElement(this.elements.buttons.play), removeElement(this.elements.captions), removeElement(this.elements.controls), removeElement(this.elements.wrapper), this.elements.buttons.play = null, this.elements.captions = null, this.elements.controls = null, this.elements.wrapper = null), is.function(e2) && e2()) : (unbindListeners.call(this), html5.cancelRequests.call(this), replaceElement(this.elements.original, this.elements.container), triggerEvent.call(this, this.elements.original, "destroyed", true), is.function(e2) && e2.call(this.elements.original), this.ready = false, setTimeout(() => {
          this.elements = null, this.media = null;
        }, 200));
      };
      this.stop(), clearTimeout(this.timers.loading), clearTimeout(this.timers.controls), clearTimeout(this.timers.resized), this.isHTML5 ? (ui.toggleNativeControls.call(this, true), i2()) : this.isYouTube ? (clearInterval(this.timers.buffering), clearInterval(this.timers.playing), null !== this.embed && is.function(this.embed.destroy) && this.embed.destroy(), i2()) : this.isVimeo && (null !== this.embed && this.embed.unload().then(i2), setTimeout(i2, 200));
    }), _defineProperty$1(this, "supports", (e2) => support.mime.call(this, e2)), this.timers = {}, this.ready = false, this.loading = false, this.failed = false, this.touch = support.touch, this.media = e, is.string(this.media) && (this.media = document.querySelectorAll(this.media)), (window.jQuery && this.media instanceof jQuery || is.nodeList(this.media) || is.array(this.media)) && (this.media = this.media[0]), this.config = extend({}, defaults, Plyr.defaults, t || {}, (() => {
      try {
        return JSON.parse(this.media.getAttribute("data-plyr-config"));
      } catch (e2) {
        return {};
      }
    })()), this.elements = { container: null, fullscreen: null, captions: null, buttons: {}, display: {}, progress: {}, inputs: {}, settings: { popup: null, menu: null, panels: {}, buttons: {} } }, this.captions = { active: null, currentTrack: -1, meta: /* @__PURE__ */ new WeakMap() }, this.fullscreen = { active: false }, this.options = { speed: [], quality: [] }, this.debug = new Console(this.config.debug), this.debug.log("Config", this.config), this.debug.log("Support", support), is.nullOrUndefined(this.media) || !is.element(this.media))
      return void this.debug.error("Setup failed: no suitable element passed");
    if (this.media.plyr)
      return void this.debug.warn("Target already setup");
    if (!this.config.enabled)
      return void this.debug.error("Setup failed: disabled by config");
    if (!support.check().api)
      return void this.debug.error("Setup failed: no support");
    const i = this.media.cloneNode(true);
    i.autoplay = false, this.elements.original = i;
    const s = this.media.tagName.toLowerCase();
    let n = null, r = null;
    switch (s) {
      case "div":
        if (n = this.media.querySelector("iframe"), is.element(n)) {
          if (r = parseUrl(n.getAttribute("src")), this.provider = getProviderByUrl(r.toString()), this.elements.container = this.media, this.media = n, this.elements.container.className = "", r.search.length) {
            const e2 = ["1", "true"];
            e2.includes(r.searchParams.get("autoplay")) && (this.config.autoplay = true), e2.includes(r.searchParams.get("loop")) && (this.config.loop.active = true), this.isYouTube ? (this.config.playsinline = e2.includes(r.searchParams.get("playsinline")), this.config.youtube.hl = r.searchParams.get("hl")) : this.config.playsinline = true;
          }
        } else
          this.provider = this.media.getAttribute(this.config.attributes.embed.provider), this.media.removeAttribute(this.config.attributes.embed.provider);
        if (is.empty(this.provider) || !Object.values(providers).includes(this.provider))
          return void this.debug.error("Setup failed: Invalid provider");
        this.type = types.video;
        break;
      case "video":
      case "audio":
        this.type = s, this.provider = providers.html5, this.media.hasAttribute("crossorigin") && (this.config.crossorigin = true), this.media.hasAttribute("autoplay") && (this.config.autoplay = true), (this.media.hasAttribute("playsinline") || this.media.hasAttribute("webkit-playsinline")) && (this.config.playsinline = true), this.media.hasAttribute("muted") && (this.config.muted = true), this.media.hasAttribute("loop") && (this.config.loop.active = true);
        break;
      default:
        return void this.debug.error("Setup failed: unsupported type");
    }
    this.supported = support.check(this.type, this.provider, this.config.playsinline), this.supported.api ? (this.eventListeners = [], this.listeners = new Listeners(this), this.storage = new Storage(this), this.media.plyr = this, is.element(this.elements.container) || (this.elements.container = createElement("div", { tabindex: 0 }), wrap(this.media, this.elements.container)), ui.migrateStyles.call(this), ui.addStyleHook.call(this), media.setup.call(this), this.config.debug && on.call(this, this.elements.container, this.config.events.join(" "), (e2) => {
      this.debug.log(`event: ${e2.type}`);
    }), this.fullscreen = new Fullscreen(this), (this.isHTML5 || this.isEmbed && !this.supported.ui) && ui.build.call(this), this.listeners.container(), this.listeners.global(), this.config.ads.enabled && (this.ads = new Ads(this)), this.isHTML5 && this.config.autoplay && this.once("canplay", () => silencePromise(this.play())), this.lastSeekTime = 0, this.config.previewThumbnails.enabled && (this.previewThumbnails = new PreviewThumbnails(this))) : this.debug.error("Setup failed: no support");
  }
  get isHTML5() {
    return this.provider === providers.html5;
  }
  get isEmbed() {
    return this.isYouTube || this.isVimeo;
  }
  get isYouTube() {
    return this.provider === providers.youtube;
  }
  get isVimeo() {
    return this.provider === providers.vimeo;
  }
  get isVideo() {
    return this.type === types.video;
  }
  get isAudio() {
    return this.type === types.audio;
  }
  get playing() {
    return Boolean(this.ready && !this.paused && !this.ended);
  }
  get paused() {
    return Boolean(this.media.paused);
  }
  get stopped() {
    return Boolean(this.paused && 0 === this.currentTime);
  }
  get ended() {
    return Boolean(this.media.ended);
  }
  set currentTime(e) {
    if (!this.duration)
      return;
    const t = is.number(e) && e > 0;
    this.media.currentTime = t ? Math.min(e, this.duration) : 0, this.debug.log(`Seeking to ${this.currentTime} seconds`);
  }
  get currentTime() {
    return Number(this.media.currentTime);
  }
  get buffered() {
    const { buffered: e } = this.media;
    return is.number(e) ? e : e && e.length && this.duration > 0 ? e.end(0) / this.duration : 0;
  }
  get seeking() {
    return Boolean(this.media.seeking);
  }
  get duration() {
    const e = parseFloat(this.config.duration), t = (this.media || {}).duration, i = is.number(t) && t !== 1 / 0 ? t : 0;
    return e || i;
  }
  set volume(e) {
    let t = e;
    is.string(t) && (t = Number(t)), is.number(t) || (t = this.storage.get("volume")), is.number(t) || ({ volume: t } = this.config), t > 1 && (t = 1), t < 0 && (t = 0), this.config.volume = t, this.media.volume = t, !is.empty(e) && this.muted && t > 0 && (this.muted = false);
  }
  get volume() {
    return Number(this.media.volume);
  }
  set muted(e) {
    let t = e;
    is.boolean(t) || (t = this.storage.get("muted")), is.boolean(t) || (t = this.config.muted), this.config.muted = t, this.media.muted = t;
  }
  get muted() {
    return Boolean(this.media.muted);
  }
  get hasAudio() {
    return !this.isHTML5 || (!!this.isAudio || (Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length)));
  }
  set speed(e) {
    let t = null;
    is.number(e) && (t = e), is.number(t) || (t = this.storage.get("speed")), is.number(t) || (t = this.config.speed.selected);
    const { minimumSpeed: i, maximumSpeed: s } = this;
    t = clamp(t, i, s), this.config.speed.selected = t, setTimeout(() => {
      this.media && (this.media.playbackRate = t);
    }, 0);
  }
  get speed() {
    return Number(this.media.playbackRate);
  }
  get minimumSpeed() {
    return this.isYouTube ? Math.min(...this.options.speed) : this.isVimeo ? 0.5 : 0.0625;
  }
  get maximumSpeed() {
    return this.isYouTube ? Math.max(...this.options.speed) : this.isVimeo ? 2 : 16;
  }
  set quality(e) {
    const t = this.config.quality, i = this.options.quality;
    if (!i.length)
      return;
    let s = [!is.empty(e) && Number(e), this.storage.get("quality"), t.selected, t.default].find(is.number), n = true;
    if (!i.includes(s)) {
      const e2 = closest(i, s);
      this.debug.warn(`Unsupported quality option: ${s}, using ${e2} instead`), s = e2, n = false;
    }
    t.selected = s, this.media.quality = s, n && this.storage.set({ quality: s });
  }
  get quality() {
    return this.media.quality;
  }
  set loop(e) {
    const t = is.boolean(e) ? e : this.config.loop.active;
    this.config.loop.active = t, this.media.loop = t;
  }
  get loop() {
    return Boolean(this.media.loop);
  }
  set source(e) {
    source.change.call(this, e);
  }
  get source() {
    return this.media.currentSrc;
  }
  get download() {
    const { download: e } = this.config.urls;
    return is.url(e) ? e : this.source;
  }
  set download(e) {
    is.url(e) && (this.config.urls.download = e, controls.setDownloadUrl.call(this));
  }
  set poster(e) {
    this.isVideo ? ui.setPoster.call(this, e, false).catch(() => {
    }) : this.debug.warn("Poster can only be set for video");
  }
  get poster() {
    return this.isVideo ? this.media.getAttribute("poster") || this.media.getAttribute("data-poster") : null;
  }
  get ratio() {
    if (!this.isVideo)
      return null;
    const e = reduceAspectRatio(getAspectRatio.call(this));
    return is.array(e) ? e.join(":") : e;
  }
  set ratio(e) {
    this.isVideo ? is.string(e) && validateAspectRatio(e) ? (this.config.ratio = reduceAspectRatio(e), setAspectRatio.call(this)) : this.debug.error(`Invalid aspect ratio specified (${e})`) : this.debug.warn("Aspect ratio can only be set for video");
  }
  set autoplay(e) {
    this.config.autoplay = is.boolean(e) ? e : this.config.autoplay;
  }
  get autoplay() {
    return Boolean(this.config.autoplay);
  }
  toggleCaptions(e) {
    captions.toggle.call(this, e, false);
  }
  set currentTrack(e) {
    captions.set.call(this, e, false), captions.setup.call(this);
  }
  get currentTrack() {
    const { toggled: e, currentTrack: t } = this.captions;
    return e ? t : -1;
  }
  set language(e) {
    captions.setLanguage.call(this, e, false);
  }
  get language() {
    return (captions.getCurrentTrack.call(this) || {}).language;
  }
  set pip(e) {
    if (!support.pip)
      return;
    const t = is.boolean(e) ? e : !this.pip;
    is.function(this.media.webkitSetPresentationMode) && this.media.webkitSetPresentationMode(t ? pip.active : pip.inactive), is.function(this.media.requestPictureInPicture) && (!this.pip && t ? this.media.requestPictureInPicture() : this.pip && !t && document.exitPictureInPicture());
  }
  get pip() {
    return support.pip ? is.empty(this.media.webkitPresentationMode) ? this.media === document.pictureInPictureElement : this.media.webkitPresentationMode === pip.active : null;
  }
  setPreviewThumbnails(e) {
    this.previewThumbnails && this.previewThumbnails.loaded && (this.previewThumbnails.destroy(), this.previewThumbnails = null), Object.assign(this.config.previewThumbnails, e), this.config.previewThumbnails.enabled && (this.previewThumbnails = new PreviewThumbnails(this));
  }
  static supported(e, t, i) {
    return support.check(e, t, i);
  }
  static loadSprite(e, t) {
    return loadSprite(e, t);
  }
  static setup(e, t = {}) {
    let i = null;
    return is.string(e) ? i = Array.from(document.querySelectorAll(e)) : is.nodeList(e) ? i = Array.from(e) : is.array(e) && (i = e.filter(is.element)), is.empty(i) ? null : i.map((e2) => new Plyr(e2, t));
  }
}
Plyr.defaults = cloneDeep(defaults);
new Plyr("#player");
export {
  __vitePreload as _,
  load as l,
  propsById as p
};
