const baseUrl = 'https://icybe.aliven.my.id'

grecaptcha.ready(async function() {
    const token = await grecaptcha.execute('6LeatvwUAAAAAANgMTBjt-eD0NkSZu2eyoaUExju', {action: 'submit'})
    console.log(token) 
    localStorage.setItem('token', token)
});

try {
    var title = new Typed('.type-title', {
        strings: [
            'iCyption'
        ],
        stringsElement: '.typed-area',
        typeSpeed: 40,
    });
} catch (err) {
    console.log(err)
}

const validateRePassword = (password,rePassword) => {
    if (password !== rePassword) return false
    else return true
}

const cekError = () => {
    console.log($('.validationFail'))
    const count = $('.validationFail').length
    console.log(count)
    if (count > 0) return true
    else return false
}

const appendMessageBelowElement = (element,message = "",type) => {
    // cek apakah element sesudahnya ada 
    const msgElm = $(element).next()
    if (msgElm.length == 1) msgElm.remove()
    if (type == false) $(element).after(`<p class="custom-message-red">${message}</p>`)
}

const cekNotelp = (element,type = "cp") => {
    if ( !cekLength(element,6,type) ) return 
    if (element.value[0] != 0) {
        $(element).removeClass('validationFail')
        $(element).removeClass('validationPass')
        $(element).addClass('validationFail')
        appendMessageBelowElement(element,`No Handphone salah format, harus diawali 0`,false)
    }else {
        $(element).removeClass('validationFail')
        $(element).removeClass('validationPass')
        $(element).addClass('validationPass')
        appendMessageBelowElement(element,true)
    }   
}

const cekLength = (element,min,type = 'cp') => {
    const field = element.value
    if (type == 'cp') {
        if (field.length < min && field.length != 0) {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationFail')
            appendMessageBelowElement(element,`Field ini minimal ${min} karakter`,false)
            return false
        }else if (field.length >= min) {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationPass')
            appendMessageBelowElement(element,true)
            return true
        }
    }else if (type="ctf"){
        if (field.length < min && field.length != 0) {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationFail')
            appendMessageBelowElement(element,`Field ini minimal ${min} karakter`,false)
            return false
        }else if (field.length >= min) {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationPass')
            appendMessageBelowElement(element,true)
            return true
        }else {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            appendMessageBelowElement(element,true)
        }
    }
    
}

const cekKosong = (element) => {
    const field = element.value
    if (field == 0) {
        $(element).removeClass('validationFail')
        $(element).removeClass('validationPass')
        $(element).addClass('validationFail')
        appendMessageBelowElement(element,`Field ini tidak boleh kosong`,false)
    }else {
        $(element).removeClass('validationFail')
        $(element).removeClass('validationPass')
        $(element).addClass('validationPass')
        appendMessageBelowElement(element,true)
    }
}

const cekEmail = (email,element,type ="cp") => {
    if (element.value != 0) {
        const n = email.indexOf("@")
        const m = email.indexOf('/')
        if (n == -1 || m != -1) {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationFail')
            return appendMessageBelowElement(element,'Format email salah',false)
        }
        axios({
            url : baseUrl + '/api/users/cekEmail/' + email,
            method : 'GET',
        })
        .then(response => {   
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationPass')
            appendMessageBelowElement(element,true)
        })
        .catch(err => {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationFail')
            console.log(err.response.data)
            appendMessageBelowElement(element,err.response.data.message,false)
        })
    }else {
        if (type=="ctf") {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            appendMessageBelowElement(element,true)
        }else {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationFail')
            appendMessageBelowElement(element,"Email tidak boleh kosong",false)
        }
    }
}




const registerCp = () => {
        const token = localStorage.getItem('token')
        // get data
        let nama = $('#cp_nama').val()
        let notelp = $('#cp_notelp').val()
        let email = $('#cp_email').val()
        let namaSekolah = $('#cp_namaSekolah').val()
        let logoSekolah = $('#cp_logoSekolah')[0].files[0]
        let fotoId = $('#cp_fotoId')[0].files[0]
        // validasi
        // if (!validateRePassword(password,rePassword))  return swal('Password dan Re-Password tidak sama')
        if ( cekError() ) return swal('Terdapat field yang berwarna merah, harap cek kembali data anda')
        let data = new FormData()
        data.append('token', token)
        data.append('nama', nama)
        data.append('notelp', notelp)
        data.append('email', email)
        data.append('namaSekolah', namaSekolah)
        // data.append('username', username)
        // data.append('password', password)
        // data.append('rePassword', rePassword)
        data.append('logoSekolah', logoSekolah)
        data.append('fotoId', fotoId)
        // send data
        axios({
            url : baseUrl + '/api/users/registerCp',
            method : 'POST',
            headers : {
                'Accept' : 'multipart/form-data'
            },
            data : data
        })
        .then(async response => {
            console.log(response.data)
            //dibawah ini lakuin kalo udah selesai/pindah halaman
            //localStorage.removeItem(token)
            $('#cp_submitBtn').show()
            $('.loading-cp').hide()
            swal(response.data.message)
            .then(()=>{
                window.location.href = "/"
            })
        })
        .catch(err => {
            console.log(err.response.data)
            $('#cp_submitBtn').show()
            $('.loading-cp').hide()
            swal(err.response.data.message)
        })
}

const validasiInput = (index) => {
    let nama = $(`#ctf_nama_${index}`).val()
    let notelp = $(`#ctf_notelp_${index}`).val()
    let email = $(`#ctf_email_${index}`).val()
    let fotoId = $(`#ctf_fotoId_${index}`)[0].files[0]
    // jika isi semua
    if (nama != "" && notelp != "" && email != "" && fotoId != undefined) {
        return [
            {fotoId}, 
            {peserta : {nama,notelp,email}} 
        ]
    }else if (nama == "" && notelp == "" && email == "" && fotoId == undefined ) {
        return []
    }else {
        // error data masih kurang
        if (index === 0) {
            swal('data leader kurang lengkap')
        }else {
            swal(`data member ke-${index} tidak lengkap`)
        }
        return {error : true}
    }
}

const validasiEmail = dataPeserta => {
    let error = false
    for (let i = 0; i < dataPeserta.length; i++) {
        for (let j = 0; j < dataPeserta.length; j++) {
            if (i !== j) {
                if (dataPeserta[i].email == dataPeserta[j].email) {
                    error = true
                }
            }
        }
    }
    return error
}

const registerCtf = () => {
    if ( cekError() ) return swal('Terdapat field yang berwarna merah, harap cek kembali data anda')
    // akun team
    const token = localStorage.getItem('token')
    let input0 = validasiInput(0)
    let input1 = validasiInput(1)
    let input2 = validasiInput(2)
    let dataArr = [input0,input1,input2]
    if (!input0.error && !input1.error && !input2.error) {
        let namaTeam = $('#ctf_namaTeam').val()
        let daerah = $('#ctf_daerah').val()
        let namaSekolah = $('#ctf_namaSekolah').val()
        let logoSekolah = $('#ctf_logoSekolah')[0].files[0]
        let fotoId = []
        let dataPeserta = []
        for (let i = 0; i < 3; i++) {
            if (dataArr[i].length != 0) {
                let foto = dataArr[i][0].fotoId
                let peserta = dataArr[i][1].peserta
                if (i==0) peserta.status = 'Leader'
                else peserta.status = 'Member'
                fotoId.push(foto)
                dataPeserta.push(peserta)
            }
        }
        // validasi email
        let error = validasiEmail(dataPeserta)
        if (error) {
            return swal('Email tidak diperbolehkan sama, silahkan cek kembali email yang digunakan')
        }
        let data = new FormData()
        data.append('token', token)
        data.append('namaTeam' , namaTeam)
        data.append('daerah' , daerah)
        data.append('namaSekolah', namaSekolah)
        data.append('logoSekolah', logoSekolah)
        
        for (let i = 0; i < fotoId.length; i++) {
            data.append('fotoId', fotoId[i])
        }
        data.append('dataPeserta' , JSON.stringify(dataPeserta))
        // send data
        axios({
            url : baseUrl + '/api/users/registerCtf',
            method : 'POST',
            headers : {
                'Accept' : 'multipart/form-data'
            },
            data : data
        })
        .then(async response => {
            console.log(response.data)
            $('#submitBtnCtf').show()
            $('.loading-ctf').hide()
            swal(response.data.message)
            .then(()=>{
                window.location.href = "/"
            })
        })
        .catch(err => {
            console.log(err.response)
            $('#submitBtnCtf').show()
            $('.loading-ctf').hide()
            swal(err.response.data.message)
        })
    }
}

$(document).ready(() => {
    $('.loading-cp').hide()
    $('.loading-ctf').hide()
    $('body').on('submit' , '#registerCpForm', e => {
        e.preventDefault();
        $('#cp_submitBtn').hide()
        $('.loading-cp').show()
        registerCp();
    })

    $('body').on('submit' , '#registerCtfForm', e => {
        e.preventDefault();
        $('#submitBtnCtf').hide()
        $('.loading-ctf').show()
        registerCtf()
    }) 

    // validation CP
    $('body').on('keyup' , '#cp_namaSekolah', elm => {
        cekKosong(elm.target)
    }) 
    $('body').on('keyup' , '#cp_nama', elm => {
        cekKosong(elm.target)
        cekLength(elm.target,3)
    }) 
    $('body').on('keyup' , '#cp_notelp', elm => {
        cekKosong(elm.target)
        cekNotelp(elm.target)
    }) 

    // ctf
    // validation Ctf
    $('body').on('keyup' , '#ctf_namaSekolah', elm => {
        cekKosong(elm.target)
    }) 
    $('body').on('keyup' , '#ctf_daerah', elm => {
        cekKosong(elm.target)
    }) 
    $('body').on('keyup' , '#ctf_namaTeam', elm => {
        cekKosong(elm.target)
    }) 

    $('body').on('keyup' , '#ctf_nama_0', elm => {
        cekKosong(elm.target)
        cekLength(elm.target,3)
    }) 
    $('body').on('keyup' , '#ctf_nama_1', elm => {
        cekLength(elm.target,3,"ctf")
    }) 
    $('body').on('keyup' , '#ctf_nama_2', elm => {
        cekLength(elm.target,3,"ctf")
    }) 

    $('body').on('keyup' , '#ctf_notelp_0', elm => {
        cekKosong(elm.target)
        cekNotelp(elm.target)
    }) 
    $('body').on('keyup' , '#ctf_notelp_1', elm => {
        cekNotelp(elm.target,"ctf")
    }) 
    $('body').on('keyup' , '#ctf_notelp_2', elm => {
        cekNotelp(elm.target,"ctf")
    })

})