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

// const cekUsername = (username,element) => {
//     if (username.length !== 0) {
//         const str = username.split(' ')
//         if (str.length != 1) {
//             swal('username tidak boleh menggunakan spasi')
//             $(element).removeClass('validationFail')
//             $(element).removeClass('validationPass')
//             $(element).addClass('validationFail')
//             return;
//         }
//         axios({
//             url : baseUrl + '/api/users/cekUsername/' + username,
//             method : 'GET',
//         })
//         .then(response => {
//             console.log(element)
//             $(element).removeClass('validationFail')
//             $(element).removeClass('validationPass')
//             $(element).addClass('validationPass')
//         })
//         .catch(err => {
//             $(element).removeClass('validationFail')
//             $(element).removeClass('validationPass')
//             $(element).addClass('validationFail')
//         })
//     }else {
//         $(element).removeClass('validationFail')
//         $(element).removeClass('validationPass')
//     } 
// }

const cekEmail = (email,element) => {
    if (email.length !== 0) {
        const n = email.indexOf("@")
        if (n == -1) {
            swal('Format email salah')
            return flashError()
        }
        axios({
            url : baseUrl + '/api/users/cekEmail/' + email,
            method : 'GET',
        })
        .then(response => {   
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationPass')
        })
        .catch(err => {
            $(element).removeClass('validationFail')
            $(element).removeClass('validationPass')
            $(element).addClass('validationFail')
        })
    }else {
        $(element).removeClass('validationFail')
        $(element).removeClass('validationPass')
    }
}




const registerCp = () => {
        const token = localStorage.getItem('token')
        // get data
        let nama = $('#cp_nama').val()
        let notelp = $('#cp_notelp').val()
        let email = $('#cp_email').val()
        // let username = $('#cp_username').val()
        // let password = $('#cp_password').val()
        // let rePassword = $('#cp_rePassword').val()
        let fotoId = $('#cp_fotoId')[0].files[0]
        // validasi
        // if (!validateRePassword(password,rePassword))  return swal('Password dan Re-Password tidak sama')
        if ( cekError() ) return swal('Terdapat field yang berwarna merah, harap cek kembali data anda')
        let data = new FormData()
        data.append('token', token)
        data.append('nama', nama)
        data.append('notelp', notelp)
        data.append('email', email)
        // data.append('username', username)
        // data.append('password', password)
        // data.append('rePassword', rePassword)
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
            swal(response.data.message)
        })
        .catch(err => {
            console.log(err.response.data)
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
    let username = $('#ctf_username').val()
    let password = $('#ctf_password').val()
    let rePassword = $('#ctf_rePassword').val()
    if (!validateRePassword(password,rePassword)) return swal('Password dan Re-Password tidak sama')
    let input0 = validasiInput(0)
    let input1 = validasiInput(1)
    let input2 = validasiInput(2)
    let dataArr = [input0,input1,input2]
    if (!input0.error && !input1.error && !input2.error) {
        let namaTeam = $('#ctf_namaTeam').val()
        let daerah = $('#ctf_daerah').val()
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
        data.append('username' , username)
        data.append('password' , password)
        data.append('rePassword' , rePassword)
        
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
            swal(response.data.message)
        })
        .catch(err => {
            console.log(err.response)
            swal(err.response.data.message)
        })
    }
}

$(document).ready(() => {
    sessionStorage.removeItem('emailErr')
    sessionStorage.removeItem('usernameErr')
    $('body').on('submit' , '#registerCpForm', e => {
        e.preventDefault();
        registerCp();
    })

    $('body').on('submit' , '#registerCtfForm', e => {
        e.preventDefault();
        registerCtf()
    }) 
})