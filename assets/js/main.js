const baseUrl = 'http://icybe.aliven.my.id'
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


const registerCp = () => {
    // get data
    grecaptcha.ready(function() {
        const token = grecaptcha.execute('6LeatvwUAAAAAANgMTBjt-eD0NkSZu2eyoaUExju', {action: 'submit'})
        alert(token)
    });
    let nama = $('#cp_nama').val()
    let notelp = $('#cp_notelp').val()
    let email = $('#cp_email').val()
    let fotoId = $('#cp_fotoId')[0].files[0]
    let data = new FormData()
    data.append('nama', nama)
    data.append('notelp', notelp)
    data.append('email', email)
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
        alert(response.data.message)
    })
    .catch(err => {
        console.log(err.response.data)
        alert(err.response.data.message)
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
            alert('data leader kurang lengkap')
        }else {
            alert(`data member ke-${index} tidak lengkap`)
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
            return alert('Email tidak diperbolehkan sama, silahkan cek kembali email yang digunakan')
        }
        let data = new FormData()
        data.append('namaTeam' , namaTeam)
        data.append('daerah' , daerah)
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
            alert(response.data.message)
        })
        .catch(err => {
            console.log(err.response)
            alert(err.response.data.message)
        })
    }
}

$(document).ready(() => {
    $('body').on('submit' , '#registerCpForm', e => {
        e.preventDefault();
        registerCp();
    })

    $('body').on('submit' , '#registerCtfForm', e => {
        e.preventDefault();
        registerCtf()
    }) 
})