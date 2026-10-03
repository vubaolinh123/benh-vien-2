let currentSlide = 0;
const slides = [...document.querySelectorAll('[data-slide]')];
function changeSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== currentSlide; slide.classList.toggle('active', i === currentSlide); });
  document.querySelectorAll('[data-goto]').forEach((button, i) => {
    button.classList.toggle('selected', i === currentSlide);
    button.setAttribute('aria-pressed', String(i === currentSlide));
  });
}
document.querySelector('.slide-arrow.prev').addEventListener('click', () => changeSlide(currentSlide - 1));
document.querySelector('.slide-arrow.next').addEventListener('click', () => changeSlide(currentSlide + 1));
document.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => changeSlide(Number(button.dataset.goto))));
document.querySelector('#open-gallery').addEventListener('click', () => {
  showModal(`${title('HÌNH ẢNH ĐẠI AN', 'Gần gũi trong từng khoảnh khắc')}<div class="gallery-grid"><figure><img src="assets/4c135fdb1e0c0e75.png" alt="Chụp X-quang"><figcaption>Hoạt động chẩn đoán hình ảnh</figcaption></figure><figure><img src="assets/b89bed8cfcf32aa1.png" alt="Lấy mẫu xét nghiệm"><figcaption>Hoạt động xét nghiệm</figcaption></figure><figure><img src="assets/9f782df485306de5.jpg" alt="Trao quà cho bệnh nhi"><figcaption>Khoảnh khắc quan tâm, chia sẻ cùng người bệnh</figcaption></figure></div><p class="source-note">Ảnh từ fanpage Bệnh viện Đa khoa Đại An.</p>`);
});

// Section interactions use the same accessible dialog and booking flow as demo 01.
const careTeam = [
  ['Khám tổng quát', 'Lắng nghe, thăm khám và hướng dẫn người bệnh lựa chọn dịch vụ phù hợp.', '55d1223a1ac3ed1d.png'],
  ['Chăm sóc trẻ em', 'Đồng hành cùng ba mẹ trong từng bước chăm sóc sức khỏe cho bé.', 'adc8d1977f6d574e.png'],
  ['Chẩn đoán hình ảnh', 'Hướng dẫn người bệnh trong quá trình thực hiện chẩn đoán hình ảnh.', '4c135fdb1e0c0e75.png'],
  ['Hoạt động xét nghiệm', 'Hỗ trợ người bệnh từ tiếp đón đến các bước lấy mẫu theo hướng dẫn.', 'b89bed8cfcf32aa1.png'],
  ['Chăm sóc người bệnh', 'Quan tâm, chia sẻ và đồng hành cùng người bệnh và gia đình.', '9f782df485306de5.jpg']
];
document.querySelector('#doctor-cards').innerHTML = careTeam.map(([name, desc, img], i) => `<button class="doctor-card" data-doctor="${i}" aria-pressed="${i === 0}"><img src="assets/${img}" alt="Ảnh hoạt động Đại An minh họa ${name}" loading="lazy"><span><small>Đội ngũ Đại An</small><strong>${name}</strong><small>Hồ sơ chuyên môn đang cập nhật</small></span></button>`).join('');
function selectDoctor(index) {
  const [name, desc, img] = careTeam[index];
  document.querySelectorAll('[data-doctor]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.doctor) === index)));
  document.querySelector('#doctor-detail').innerHTML = `<img src="assets/${img}" alt="Hoạt động ${name}"><div><p class="eyebrow">ĐỘI NGŨ CHĂM SÓC ĐẠI AN</p><h3>${name}</h3><p>${desc}</p><p class="profile-note">Khung hồ sơ minh họa. Ảnh hoạt động thực tế từ fanpage; tên, học vị và lịch khám của bác sĩ sẽ được bệnh viện bổ sung.</p><button class="button outline" data-book>Đặt lịch khám</button></div>`;
}
selectDoctor(0);
const departments = [
 ['Khám tổng quát','cross',0],['Sản – Phụ khoa','heart',1],['Nhi khoa','users',2],['Tai Mũi Họng','shield',3],['Chẩn đoán hình ảnh','file',4],['Xét nghiệm','search',5],['Ngoại khoa','cross',6],['Tư vấn sức khỏe','message',7],['Nội khoa','heart',null],['Mắt','search',null],['Răng Hàm Mặt','shield',null],['Cơ xương khớp','users',null]
];
document.querySelector('#department-grid').innerHTML = departments.map(([name, symbol, id]) => `<button ${id === null ? `data-department="${name}"` : `data-specialty="${id}"`}><i>${icon(symbol)}</i><strong>${name}</strong></button>`).join('');
const gallery = [
 ['4c135fdb1e0c0e75.png','Hoạt động chẩn đoán hình ảnh'],['b89bed8cfcf32aa1.png','Hoạt động lấy mẫu xét nghiệm'],['55d1223a1ac3ed1d.png','Lắng nghe trong từng thăm khám'],['adc8d1977f6d574e.png','Đồng hành cùng sức khỏe cộng đồng'],['9f782df485306de5.jpg','Sẻ chia niềm vui cùng bệnh nhi'],['98e18acf2b0b12e7.png','Không gian thăm khám tại Đại An']
];
document.querySelector('#photo-thumbs').innerHTML = [4,3,0].map((id,i) => `<button data-photo="${id}" aria-label="Xem ảnh: ${gallery[id][1]}" aria-pressed="${i===0}"><img src="assets/${gallery[id][0]}" alt="${gallery[id][1]}" loading="lazy"></button>`).join('');
function selectPhoto(id) {
 document.querySelector('#photo-main').innerHTML = `<img src="assets/${gallery[id][0]}" alt="${gallery[id][1]}" loading="lazy"><span>${gallery[id][1]}</span>`;
 document.querySelector('#photo-main').dataset.gallery = id;
 document.querySelectorAll('[data-photo]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.photo)===id)));
}
selectPhoto(4);
const questions = [
 ['Đặt lịch khám','Tôi có thể đặt lịch khám trước như thế nào?','Tôi muốn chủ động thời gian đến viện và biết lịch khám của chuyên khoa. Cần liên hệ qua kênh nào?','Bạn có thể gọi hotline 0947 907 636 hoặc nhắn fanpage Đại An để xác nhận lịch khám. Biểu mẫu trên website là bản trình diễn, chưa gửi yêu cầu đến bệnh viện.'],
 ['Hướng dẫn khám','Đến khám lần đầu cần chuẩn bị những gì?','Tôi lần đầu đến Đại An. Tôi nên mang theo giấy tờ và hồ sơ nào để được hướng dẫn thuận tiện?','Bạn có thể chuẩn bị giấy tờ tùy thân, thông tin BHYT và hồ sơ khám trước đây nếu có. Liên hệ bệnh viện để được hướng dẫn riêng theo dịch vụ.'],
 ['Lịch làm việc','Có thể đến khám vào cuối tuần không?','Gia đình tôi muốn sắp xếp đến khám vào thứ Bảy hoặc Chủ nhật. Làm thế nào để xác nhận lịch?','Fanpage thông báo bệnh viện làm việc tất cả các ngày trong tuần. Gọi hotline để xác nhận lịch chuyên khoa và thời gian phù hợp trước khi đến.'],
 ['Bảng giá','Tôi có thể tìm hiểu chi phí khám ở đâu?','Tôi muốn tham khảo thông tin chi phí trước khi lựa chọn dịch vụ và đặt lịch khám.','Bảng giá chính thức đang chờ bệnh viện cung cấp. Vui lòng liên hệ hotline để được tư vấn; bản demo không đưa ra mức phí giả định.'],
 ['Kết quả khám','Chức năng tra cứu kết quả hoạt động thế nào?','Tôi thấy website có mục tra cứu kết quả. Tôi có thể sử dụng mã bệnh án thực tế ở đây không?','Đây là chức năng demo, chỉ dùng mã DA-DEMO và số điện thoại 0900000000. Không nhập dữ liệu cá nhân hay mã bệnh án thực tế.'],
 ['Liên hệ','Tôi muốn gửi góp ý về trải nghiệm khám bệnh','Tôi có ý kiến muốn chia sẻ cùng bệnh viện và mong nhận được phản hồi từ bộ phận hỗ trợ.','Bạn có thể gửi tin nhắn qua fanpage Đại An hoặc gọi hotline. Biểu mẫu góp ý trên website chỉ minh họa giao diện, không gửi hoặc lưu nội dung.']
];
function renderQuestions(page=0) {
 document.querySelector('#qa-grid').innerHTML=questions.slice(page*2,page*2+2).map(([category,name,excerpt],i)=>`<article class="question-card"><div class="question-person"><span>${icon('users')}</span><div><strong>Khách hàng quan tâm</strong><small>Câu hỏi minh họa</small></div></div><div class="question-bubble"><small>${category}</small><h3>${name}</h3><p>${excerpt}</p><button class="button" data-answer="${page*2+i}">${icon('message')} Xem câu trả lời</button></div></article>`).join('');
 document.querySelector('#qa-pager').innerHTML=[0,1,2].map(i=>`<button data-qa-page="${i}" aria-label="Trang câu hỏi ${i+1}" aria-pressed="${page===i}"></button>`).join('');
}
renderQuestions();
const editorial = [
 {name:posts[1].title,img:posts[1].image,desc:posts[1].excerpt,attr:'data-post="cong-dong"'},
 {name:posts[0].title,img:posts[0].image,desc:posts[0].excerpt,attr:'data-post="ho-hap"'},
 {name:posts[2].title,img:posts[2].image,desc:posts[2].excerpt,attr:'data-post="tuyen-dung"'},
 {name:'Hướng dẫn chuẩn bị trước khi đến khám',img:'55d1223a1ac3ed1d.png',desc:'Thông tin hướng dẫn minh họa cho người bệnh và gia đình.',attr:'data-info="guide"'},
 {name:'Những khoảnh khắc sẻ chia tại Đại An',img:'9f782df485306de5.jpg',desc:'Khám phá thư viện ảnh hoạt động bệnh viện.',attr:'data-gallery="4"'}
];
function story(item, cls='') {return `<article class="editorial-card ${cls}"><button ${item.attr}><img src="assets/${item.img}" alt="${item.name}" loading="lazy"><h3>${item.name}</h3></button><p>${item.desc}</p></article>`;}
document.querySelector('#featured-news').innerHTML=editorial.map((item,i)=>story(item,i===0?'editorial-lead':'')).join('');
document.querySelector('#health-stories').innerHTML=[editorial[1],editorial[3]].map(item=>story(item,'horizontal-story')).join('');
document.querySelector('#hospital-stories').innerHTML=[editorial[0],editorial[4]].map(item=>story(item)).join('');
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.doctor!==undefined)selectDoctor(Number(b.dataset.doctor));
 if(b.dataset.photo!==undefined)selectPhoto(Number(b.dataset.photo));
 if(b.dataset.gallery!==undefined){const [img,name]=gallery[Number(b.dataset.gallery)];showModal(`${title('THƯ VIỆN HÌNH ẢNH',name)}<img class="gallery-full" src="assets/${img}" alt="${name}"><p class="source-note">Ảnh hoạt động từ fanpage Đại An.</p><div class="gallery-nav">${gallery.map(([_,label],i)=>`<button class="text-link" data-gallery="${i}">${label}</button>`).join('')}</div>`);}
 if(b.dataset.video!==undefined){const id=Number(b.dataset.video);showModal(`${title('THƯ VIỆN VIDEO',id===0?'Đồng hành cùng sức khỏe cộng đồng':'Một vòng không gian thăm khám')}<video class="demo-video" controls playsinline autoplay poster="assets/${id===0?'adc8d1977f6d574e.png':'4c135fdb1e0c0e75.png'}"><source src="assets/${id===0?'community-demo':'facilities-demo'}.mp4" type="video/mp4"></video><p class="source-note">Video trình chiếu ảnh fanpage, dựng cho bản demo. Không có âm thanh.</p>`);}
 if(b.dataset.qaPage!==undefined)renderQuestions(Number(b.dataset.qaPage));
 if(b.dataset.answer!==undefined){const q=questions[Number(b.dataset.answer)];showModal(`${title(q[0],q[1])}<p class="article-text">${q[3]}</p><p class="source-note">Câu hỏi minh họa cho bản demo.</p><button class="button" data-book>Trải nghiệm đặt lịch</button>`);}
 if(b.dataset.department){showModal(`${title('CHUYÊN KHOA MINH HỌA',b.dataset.department)}<p>Vị trí danh mục dùng để trình diễn bố cục. Thông tin dịch vụ và lịch khám đang chờ bệnh viện xác nhận.</p><a class="button" href="tel:0947907636">Liên hệ bệnh viện</a>`);}
 if(b.hasAttribute('data-team-list'))showModal(`${title('ĐỘI NGŨ ĐẠI AN','Đồng hành cùng người bệnh')}<p>Hồ sơ bác sĩ, học vị và lịch khám sẽ được cập nhật khi bệnh viện cung cấp thông tin chính thức.</p><button class="button" data-book>Đặt lịch tư vấn</button>`);
 if(b.dataset.policy)showModal(`${title('ĐẠI AN · DEMO 02',b.dataset.policy==='privacy'?'Thông tin bảo mật bản demo':'Thông tin bản trình diễn')}<p>Đây là website trình diễn giao diện. Các biểu mẫu không lưu hoặc gửi dữ liệu đến bệnh viện. Vui lòng chỉ dùng dữ liệu giả để trải nghiệm.</p><p>Thông tin pháp lý, chính sách chính thức và hồ sơ chuyên môn cần được bệnh viện duyệt trước khi vận hành. Các liên kết Facebook, TikTok và bản đồ dẫn đến dịch vụ bên ngoài.</p>`);
});
modal.addEventListener('close',()=>content.querySelectorAll('video').forEach(video=>video.pause()));
