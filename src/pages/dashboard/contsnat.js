import {
  ClockCircleOutlined
} from "@ant-design/icons";


const COURSES=[{
  title:'Introduction to Python Programming',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-7.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'1'
},{
  title:'Digital Marketing Fundamentals',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-8.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'2'
},{
  title:'Data Science with R',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-9.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'3'
},{
  title:'Graphic Design Essentials',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-10.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'4'
},{
  title:'Financial Planning for Beginners',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-11.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'5'
},{
  title:'Human Resource Management Basics',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-12.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'6'
},{
  title:'Data Science with R',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-7.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'7'
},{
  title:'Data Science with R',
  hours:'1h 40m',
  people:'12',
  price:'$83.74',
  image:'https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/mock/assets/images/course/course-7.webp',
  video:'',
  subscriptions:'year',
  status:'joined',
  id:'8'
}];


const ScenesOptions = [
  {
    label: '5-7',
    value: '5-7',
    desc: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ClockCircleOutlined className="pr-3" />
        {`${(((5 + 7) / 2) * 10 / 60).toFixed(2)} min`}
      </div>
    ),
  },
  {
    label: '8-10',
    value: '8-10',
    desc: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ClockCircleOutlined className="pr-3" />
        {`${(((8 + 10) / 2) * 10 / 60).toFixed(2)} min`}
      </div>
    ),
  },
  {
    label: '11-15',
    value: '11-15',
    desc: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ClockCircleOutlined className="pr-3" />
        {`${(((11 + 15) / 2) * 10 / 60).toFixed(2)} min`}
      </div>
    ),
  },
  {
    label: '16-20',
    value: '16-20',
    desc: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ClockCircleOutlined className="pr-3" />
        {`${(((16 + 20) / 2) * 10 / 60).toFixed(2)} min`}
      </div>
    ),
  },
];


export {
  COURSES,
  ScenesOptions
};

