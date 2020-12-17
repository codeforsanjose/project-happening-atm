import React, { useCallback, useState } from 'react';
// import logo from '../../assets/logo.svg';
import './MeetingView.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import MeetingItemListView from './MeetingItemListView';

function MeetingView() {
  const [items, setItems] = useState(Array.from({ length: 60 }));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = useCallback(() => {
    if (items.length >= 100) {
      setHasMore(false);
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })));
    }, 500);
  }, [items, setItems, setHasMore]);

  return (
    <div className="meeting-view">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={(
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
              )}
      >
        {items.map((i, index) => (
          // TODO: https://github.com/codeforsanjose/gov-agenda-notifier/issues/82
          <MeetingItemListView key={`MeetingItemListView-${index.toString}`} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default MeetingView;
