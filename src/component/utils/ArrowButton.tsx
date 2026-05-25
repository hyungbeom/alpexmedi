export default function ArrowButton(){


    return <div>


        <Arrow/>
        <div style={{
            marginLeft : 65,
            width: 70,
            height: 70,
            border: '1px solid black', // 선 두께, 종류, 색상
            borderRadius: '50%',         // 사각형을 원으로 만드는 핵심 속성
            display: 'flex',             // 원 내부에 텍스트를 중앙 정렬하고 싶을 때 사용
            justifyContent: 'center',
            alignItems: 'center'
        }}/>
    </div>
}


export function Arrow(){

    return   <div style={{

        marginBottom : -40,
        display: 'flex',
        alignItems: 'center', // 가로선과 화살표 머리의 높이를 완벽하게 맞춤
        position: 'relative',
        width: 100,        // 화살표 전체의 원하는 길이
        height: 10
    }}>
        {/* 1. 화살표 몸통 (가로선) */}
        <div style={{
            width: 100,             // 부모 너비를 꽉 채움
            height: 1,             // 선의 두께 (화살표 머리 두께와 맞춤)
            backgroundColor: 'black' // 선 색상
        }} />

        {/* 2. 화살표 머리 (꺽쇠) */}
        <div style={{
            width: 8,              // 머리 크기
            height: 8,
            borderTop: '1px solid black',
            borderRight: '1px solid black',
            transform: 'rotate(45deg)', // 회전시켜서 뾰족하게 만듦
            position: 'absolute',
            right: 0                    // 오른쪽 끝에 딱 붙임
        }} />
    </div>
}