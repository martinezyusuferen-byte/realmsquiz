import { motion } from 'motion/react';
import { X, Heart, ShieldAlert, Clock, Moon, Sparkles, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onClose: () => void;
}

export function PolicyScreen({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto"
    >
      <div className="sticky top-0 left-0 right-0 z-10 flex justify-end p-6 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none">
        <button
          onClick={onClose}
          className="pointer-events-auto p-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white shadow-lg"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-32 -mt-16">
        <div className="flex flex-col items-center text-center space-y-6 pt-16 mb-16">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-800 shadow-xl">
            <Heart className="w-12 h-12 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 tracking-tight leading-tight">
            Dijital Sağlığınız Her Realm'den Daha Önemli
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light">
            Sınırsız bilgiye erişim muazzam bir güçtür, ancak bu gücün zihinsel ve fiziksel sağlığımıza zarar vermemesini sağlamak bizim en temel görevimizdir.
          </p>
        </div>

        <div className="space-y-12 text-lg md:text-xl text-slate-300 leading-relaxed font-light">
          
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <ShieldAlert className="w-8 h-8 mr-4 text-cyan-400" />
              Neden Böyle Bir Kısıtlama Var?
            </h2>
            <p>
              Günümüzde ekranlara olan bağımlılık her geçen gün artıyor. Özellikle genç zihinler ve gelişim çağındaki çocuklar için gece geç saatlerde ekran ışığına maruz kalmak, uyku düzenini geri döndürülemez şekilde bozabilir. Biz, <strong className="text-white font-medium">RealmsQuiz</strong> olarak, sadece eğlenmenizi ve öğrenmenizi değil, aynı zamanda sağlıklı bir yaşam sürmenizi de önemsiyoruz. 
            </p>
            <p>
              Uyku, zihnin en iyi şekilde yenilendiği, öğrendiklerini hafızaya kazıdığı yegane süreçtir. Gece 00:00 ile sabah 06:00 arasında beyin, günün yorgunluğunu atmak zorundadır. Bu saatlerde dijital alemlerde gezinmek, biyolojik saatinizi altüst ederek, ertesi gün yaşayacağınız yorgunluğa, odaklanma sorunlarına ve uzun vadede ciddi sağlık problemlerine yol açar.
            </p>
          </section>

          <div className="my-16 border-t border-slate-800 pt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Gerçek RealmsQuiz Anasayfası ve Son Dakikalar Bildirimi</h3>
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl pb-16">
               <div className="w-full h-12 bg-slate-950 flex items-center px-4 border-b border-slate-800">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
               </div>
               
               <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
                  <div className="text-center space-y-4 mb-12">
                    <div className="flex items-center justify-center space-x-3 text-5xl font-black tracking-tight">
                      <Sparkles className="w-10 h-10 text-fuchsia-400" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">
                        RealmsQuiz
                      </span>
                    </div>
                    <p className="text-lg text-slate-400">Sonsuz bilgi alemlerini keşfet.</p>
                  </div>
                  
                  <div className="w-full max-w-xl relative flex items-center bg-slate-950 border border-slate-700/50 rounded-2xl p-2 shadow-2xl opacity-50 pointer-events-none">
                     <div className="w-6 h-6 rounded-full bg-slate-700 ml-4"></div>
                     <div className="w-full bg-transparent text-xl px-4 py-4 text-slate-500">Herhangi bir konu yaz...</div>
                     <div className="px-8 py-4 bg-slate-700 text-slate-400 font-bold rounded-xl">Başla</div>
                  </div>
               </div>

               {/* EXACT MATCH of TimeWarningNotification.tsx */}
               <div className="absolute bottom-6 right-6 z-[100] flex items-center gap-4 bg-white/95 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] max-w-sm md:max-w-md">
                 <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                    <Clock className="w-6 h-6 text-indigo-500" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-indigo-400"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                 </div>
                 <div className="pr-2">
                   <h4 className="font-bold uppercase tracking-wider text-xs mb-1 text-indigo-600">
                     Dinlenme Vakti
                   </h4>
                   <p className="text-slate-600 text-sm font-medium leading-relaxed">
                     Zihninizi dinlendirmek ve yarına enerji toplamak için 8 dakika sonra bugünün serüvenine ara vereceğiz.
                   </p>
                 </div>
               </div>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">Gece Yarısı Kuralı ve Çocuklar</h2>
            <p>
              Çocukların ve gençlerin bilişsel gelişimi için kesintisiz uyku kritik bir öneme sahiptir. Araştırmalar, uyku öncesi ekrana bakmanın melatonin hormonunu baskıladığını ve uykuya dalmayı zorlaştırdığını kanıtlamıştır. Bir uygulamanın "sonsuz içerik" veya "oynamaya devam et" hissi yaratması, genç zihinlerin ekranı bırakmasını imkansız hale getirebilir.
            </p>
            <p>
              Bu nedenle kontrolü kullanıcının inisiyatifine bırakmıyoruz. Saat tam 00:00 olduğunda, devam eden bir maçta olsanız dahi sistem sizi dışarı çıkarır. Yeni bir <strong className="text-fuchsia-400">Realm</strong> (alem) yaratılmasına kesinlikle izin verilmez. Bu, oyunun bozulduğu veya bittiği anlamına gelmez; sadece gerçek dünyada dinlenmeniz gerektiği anlamına gelir.
            </p>
          </section>

          <div className="my-16 border-t border-slate-800 pt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">00:00'dan Sonra Arama Yapıldığındaki Uyarı Ekranı</h3>
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950 -z-10"></div>
              
              <div className="text-center z-10 w-full max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-200">Bu saatte Realm oluşturulamaz.</h2>
                <p className="mt-6 text-slate-500 text-sm italic">Sistem saat 00:00'ı geçtiğinde yeni bir oyun başlatmaya çalıştığınızda bu uyarıyı alırsınız.</p>
              </div>
            </div>
          </div>

          <div className="my-16 border-t border-slate-800 pt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Oyun Esnasında Süre Dolduğundaki "Dinlenme" Ekranı</h3>
            <p className="text-center text-slate-400 mb-8 max-w-3xl mx-auto">Eğer süreniz dolduğunda halihazırda bir oyun oynuyorsanız, oyununuz nazikçe durdurulur ve dinlenmeniz gerektiği hatırlatılır. Bu ekran, kullanıcının kendi rızasıyla ekranı kapatmasını teşvik eder.</p>
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md -z-10"></div>
              
              <div className="text-center z-10 w-full max-w-3xl">
                  <h2 className="text-3xl font-medium text-slate-200 mb-8">
                    Şimdi ekranı kapatma vakti.
                  </h2>
                  <div className="flex flex-col items-center justify-center gap-6 mt-8">
                    <div className="px-10 py-5 bg-white text-slate-950 font-bold rounded-2xl w-full sm:w-auto text-lg shadow-lg opacity-80 cursor-not-allowed">
                      Anladım, Dinlenmeye Gidiyorum
                    </div>
                  </div>
              </div>
            </div>
          </div>
          
          <div className="my-16 border-t border-slate-800 pt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Sistem Kilitlendiğinde Sabah 06:00'ya Kadar Kilit Ekranı</h3>
            <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700 bg-black shadow-2xl h-[500px] flex flex-col items-center justify-center p-8 text-center text-white">
              <div className="absolute inset-0 bg-black -z-10"></div>
              
              <div className="w-full text-center py-12 space-y-8">
                <Moon className="w-20 h-20 text-slate-500 mx-auto opacity-70" />
                <h3 className="text-4xl md:text-5xl font-light text-slate-300 tracking-wide">
                  RealmsQuiz Şu An Uygun Değil.
                </h3>
                <p className="text-slate-500 text-xl font-light">
                  Yarın sabah yeni maceralarda görüşmek üzere.
                </p>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">Sorumluluk Reddi ve Kararlılık</h2>
            <p>
              Dijital platformların bizi sürekli daha fazla etkileşime zorladığı bir çağda, biz tam tersini savunuyoruz. Özgürlük, istediğin zaman uygulamayı kullanabilmek değildir; bazen özgürlük, uygulamanın seni "dur" diyerek korumasıdır.
            </p>
            <p>
              Ertesi sabah saat 06:00 itibarıyla boyut kapıları yeniden açıldığında, çok daha dinç, çok daha zeki ve çok daha enerjik bir şekilde yeni bilgilere yelken açabileceksiniz. Kısıtlamamız, sizin özgürlüğünüzü elinizden almak için değil, yaşam kalitenizi artırmak için var.
            </p>
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-500 pt-8">
              Lütfen unutmayın: En muhteşem Realm, sizin sağlıklı zihninizdir.
            </p>
          </section>

        </div>
      </div>
    </motion.div>
  );
}
