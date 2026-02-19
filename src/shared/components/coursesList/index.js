import React, { useState } from 'react';
import styles from './courseslist.module.scss';
import { Progress, Image, Pagination } from 'antd';
import { VaTitle } from '../typography';
import { Link } from 'react-router-dom';
import {searchCourseVideoList} from '../../../pages/dashboard/redux/courseSlice';

export default function CoursesList(props) {
  const { data, isProgress, openCourse } = props;
  const ITEMS_PER_PAGE = 15; // Number of items per page

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Get current items based on the current page
  const currentItems = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className={styles.wrapper}>
        {currentItems.map((item) => (
          <Link
            to={`/dashboard/${item?.course_id}`}
            key={item.id}
            className={styles.card}
            onClick={() => openCourse(item)}
          >
            <Image
              preview={false}
              src={
                item?.thumbnail_image
                  ? `https://va-sc-images.s3.amazonaws.com/${item?.thumbnail_image}`
                  : require(`../../../asset/images/course.png`)
              }
            />
            <div className={styles.footer}>
              <div className={styles.title}>
                <VaTitle
                  level={5}
                  ellipsis={{
                    rows: 2
                  }}
                  text={item?.title}
                />
              </div>
              {isProgress && (
                <div className={styles.actions}>
                  <Progress percent={30} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      {searchCourseVideoList && data.length > 15 && (
      <Pagination
        current={currentPage}
        align="center"
        total={data.length}
        pageSize={ITEMS_PER_PAGE}
        onChange={(page) => setCurrentPage(page)}
        style={{
          marginTop: '20px'
        }}
      />
      )}
    </div>
  );
}
