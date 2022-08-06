export class GroupingUtil {

    // static From(groupColumns: GroupingOptions[], columns: Column[]) {
    //     const _groupColumns = groupColumns.map(gc => new GroupingOptions(gc));
    //     GroupingUtil.updateGroupingColumnsWidth(_groupColumns, columns);
    //     GroupingUtil.fillEmptySpace(_groupColumns);
    //     return _groupColumns;
    // }

    // static fillEmptySpace(groupColumns: GroupingOptions[]) {
    //     const totalWidthUsed = groupColumns.reduce((acc, c) => acc + parseFloat(c.width.slice(0, -1)), 0);
    //     const emptySpace = 100 - totalWidthUsed;
    //     if (emptySpace) {
    //         groupColumns.push(new GroupingOptions({
    //             id: '__empty__',
    //             groupBy: false,
    //             width: emptySpace + '%',
    //             mutateLabel: (data, groupData) => ''
    //         }));
    //     }
    // }
}
