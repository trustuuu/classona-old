import firebase from 'firebase';
//import '@firebase/auth';
import { Dimensions } from 'react-native';

const iPhoneSize = () => {
  const windowWidth = Dimensions.get('window').width;
  if (windowWidth === 320) {
    return 'small'; // iPhone SE - small
  } if (windowWidth === 414) {
    return 'large'; // iPhone Plus - large
  }
  return 'medium'; // iPhone 6/7 - medium
};

export default iPhoneSize;

function formatTwoDigits(n) {
    return n < 10 ? '0' + n : n;
}

const isNumber = subject => typeof subject === 'number'

//Refer: https://github.com/kaelzhang/moving-averages/blob/master/src/ma.js
//Get Moving Average in data
export function ma(data, size) {
    const length = data.length
    if (!size) {
      return data.reduce((a, b) => a + b) / length
    }

    const prepare = size - 1
    const ret = []

    let sum = 0
    let i = 0
    let counter = 0
    let datum

    for (; i < length && counter < prepare; i ++) {
        datum = data[i]

        sum += datum
        counter ++
    }

    for (; i < length; i ++) {
        datum = data[i]

        if (isNumber(datum)) {
            sum += datum
        }

        if (isNumber(data[i - size])) {
            sum -= data[i - size]
        }

        ret[i] = sum / size
    }
    return ret
}

/**
 * Format time to "HH:mm:ss" or "mm:ss"
 */
export function formatTime(seconds) {
    const ss = Math.floor(seconds) % 60;
    const mm = Math.floor(seconds / 60) % 60;
    const hh = Math.floor(seconds / 3600);

    if(hh > 0) {
        return hh + ':' + formatTwoDigits(mm) + ':' + formatTwoDigits(ss);
    } else {
        return mm + ':' + formatTwoDigits(ss);
    }
}

export function convertSecToDate(seconds)
{
    var curdate = new Date(null);
    curdate.setTime(seconds*1000);
    return curdate;
}


export function convertSecToDateForReceipt(seconds)
{
    var curdate = new Date(null);
    curdate.setTime(seconds);
    return curdate;
}


export const accountPath = (studentEmail) => {
    if (studentEmail){
        return `/users/${studentEmail}`;
    }
    else{
        const {currentUser} = firebase.auth();
        return `/users/${currentUser.email}`;
    }
}


export const instructorPath = (instructorEmail) => {
    if (instructorEmail){
        return `/instructors/${instructorEmail}`;
    }
    else{
        const {currentUser} = firebase.auth();
        return `/instructors/${currentUser.email}`;
    }
}

export const getMediaDetail = (media) => {
    //james@sample.com_Conversation Class_ETC_3_1548742488_1.wav
    const mediaArray = media.split('_');
    const classSec = mediaArray[4];
    const classDate = convertSecToDate(classSec).toLocaleString();

    const mediaObject = {
                            'itemSeq': mediaArray[mediaArray.length -1].split('.')[0],
                            'className': `${mediaArray[1]}_${mediaArray[4]}`,
                            classSec: classSec,
                            classDate: classDate,
                            'Institution': mediaArray[2],
                            'fileUser': mediaArray[0],
                            'participantNum': mediaArray[3]
                        }
                       
    return mediaObject;
}

export const getPlanDetails = (productId) => {
    
    const products = [
        {
            os: 'ios',
            productId: 'com.igoodworks.classona.monthly1',
            description: '',
            days: 30,
        },
        {
            os: 'ios',
            productId: 'com.igoodworks.classona.quarterly',
            description: '',
            days: 90,
        }
    ]
    
    return products;
}