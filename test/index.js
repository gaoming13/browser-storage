if (browserStore.localStoreIsSupport && browserStore.cookieStoreIsSupport) {
  describe('local storage + cookie环境下', () => {
    describe('依照优先级lc', () => {
      it('能否设置成功?', () => {
        browserStore.setPriority('lc');
        browserStore.setItem('key1', 'value1');
        expect(browserStore.getItem('key1')).to.equal('value1');
      });

      it('能否按优先级?', () => {
        browserStore.setPriority('c');
        expect(browserStore.getItem('key1')).to.equal(null);

        browserStore.setPriority('l');
        expect(browserStore.getItem('key1')).to.equal('value1');

        browserStore.setPriority('lc');
      });

      it('能否删除成功?', () => {
        browserStore.removeItem('key1');
        expect(browserStore.getItem('key1')).to.equal(null);
      });
    });

    describe('依照优先级l', () => {
      it('能否设置成功?', () => {
        browserStore.setPriority('l');
        browserStore.setItem('key1', 'value1');
        expect(browserStore.getItem('key1')).to.equal('value1');
      });

      it('能否按优先级?', () => {
        browserStore.setPriority('c');
        expect(browserStore.getItem('key1')).to.equal(null);

        browserStore.setPriority('l');
      });

      it('能否删除成功?', () => {
        browserStore.removeItem('key1');
        expect(browserStore.getItem('key1')).to.equal(null);
      });
    });

    describe('依照优先级c', () => {
      it('能否设置成功?', () => {
        browserStore.setPriority('c');
        browserStore.setItem('key1', 'value1');
        expect(browserStore.getItem('key1')).to.equal('value1');
      });

      it('能否按优先级?', () => {
        browserStore.setPriority('l');
        expect(browserStore.getItem('key1')).to.equal(null);

        browserStore.setPriority('c');
      });

      it('能否删除成功?', () => {
        browserStore.removeItem('key1');
        expect(browserStore.getItem('key1')).to.equal(null);
      });
    });
  });
}