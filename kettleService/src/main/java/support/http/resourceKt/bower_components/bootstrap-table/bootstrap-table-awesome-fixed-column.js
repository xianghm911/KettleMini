/**
 * @name: awesome-fixed-bootstrapTable.js
 * @author Minson
 * @version: v1.0.0
 * @time: 2018.12.05
 * @desc: init the bootstrapTable using the fixedColums，fixedNumber or the columns'options contain the fixed param
 *        support: the left columns merge cells
 */

(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        fixedColumns: false,
        fixedNumber: 0,
    }, {
        leftFixedIndex: -1,
        rightFixedIndex: -1,
        fixedTableShowStatus: 3,
        initFixedTable: true,
        leftFixedFields: []
    });


    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initHeader = BootstrapTable.prototype.initHeader,
        _initBody = BootstrapTable.prototype.initBody,
        _resetView = BootstrapTable.prototype.resetView,
        _fitHeader = BootstrapTable.prototype.fitHeader,
        _mergeCells = BootstrapTable.prototype.mergeCells;

    /**
     * init the fix table (both left and right)
     */
    BootstrapTable.prototype.initFixedColumns = function () {

        //left table
        this.$leftFixedHeader = $([
            '<div class="awesome-table-header">',
            '<table class="table">',
            '<thead></thead>',
            '</table>',
            '</div>',
        ].join(''));

        this.$leftFixedHeader.find('table').attr('class', this.$el.attr('class'));
        this.$leftFixedHeaderColumns = this.$leftFixedHeader.find('thead');

        this.$leftFixedBody = $([
            '<div class="awesome-table-body">',
            '<table class="awesome-table">',
            '<tbody></tbody>',
            '</table>',
            '</div>',
        ].join(''));

        this.$leftFixedBody.find('table').attr('class', this.$el.attr('class'));
        this.$leftFixedBodyColumns = this.$leftFixedBody.find('tbody');
        this.$leftFixedBodyColumnsTable = this.$leftFixedBody.find('table');

        this.$leftFixedBox = $([
            '<div class="awesome-table-fixed awesome-table-fixed-l" style="display:none">',
            '</div>',
        ].join(''));

        this.$leftFixedBox.append(this.$leftFixedHeader).append(this.$leftFixedBody);

        //right table
        this.$rightFixedHeader = $([
            '<div class="awesome-table-header">',
            '<table class="table">',
            '<thead></thead>',
            '</table>',
            '</div>',
        ].join(''));

        this.$rightFixedHeader.find('table').attr('class', this.$el.attr('class'));
        this.$rightFixedHeaderColumns = this.$rightFixedHeader.find('thead');

        this.$rightFixedBody = $([
            '<div class="awesome-table-body">',
            '<table class="awesome-table">',
            '<tbody></tbody>',
            '</table>',
            '</div>',
        ].join(''));

        this.$rightFixedBody.find('table').attr('class', this.$el.attr('class'));
        this.$rightFixedBodyColumns = this.$rightFixedBody.find('tbody');
        this.$rightFixedBodyColumnsTable = this.$rightFixedBody.find('table');

        this.$rightFixedBox = $([
            '<div class="awesome-table-fixed awesome-table-fixed-r" style="display:none">',
            '</div>',
        ].join(''));

        this.$rightFixedBox.append(this.$rightFixedHeader).append(this.$rightFixedBody);
        //add left and right table
        this.$tableContainer.append(this.$leftFixedBox);
        this.$tableContainer.append(this.$rightFixedBox);

        this.options.fixedTableShowStatus = 3;
    };

    /**
     * init the header
     */
    BootstrapTable.prototype.initHeader = function () {
        _initHeader.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.fixedColumns) {
            return;
        }

        this.initFixedColumns();

        var that = this,
            columns = that.options.columns[0],
            len = columns.length,
            $ltrs = that.$header.find('tr:eq(0)').clone(),
            $rtrs = $ltrs.clone(),
            fixedNumber = that.options.fixedNumber,
            i = 0;

        //get left header table data
        //this array aims to keep the fixed fileds that is determine the necessary of merging cells.
        that.options.leftFixedFields = [];
        that.options.leftFixedIndex = 0;
        console.log(that.options.fixedNumber)
        while (i < len) {
            if ((!(columns[i].fixed) && fixedNumber < 1) || (fixedNumber > 0 && fixedNumber == i)) {
                break;
            }

            that.options.leftFixedFields.push(columns[i].field);
            i++;
        }
        console.log(i)
        if (i === 0) {
            that.options.leftFixedIndex = -1;
            that.$leftFixedBox.html('');
        } else {
            that.options.leftFixedIndex = (columns[i - 1]).fieldIndex;

            $ltrs.each(function () {
                $(this).find('th:gt(' + (i-1) + ')').remove();
                $(this).height($(this).height());
            });

            that.$leftFixedHeaderColumns.html('').append($ltrs);
        }


        //get right header table data
        i = len - 1;
        while (i > -1) {
            if (!(columns[i].fixed)) {
                break;
            }
            i--;
        }

        if (i === (len - 1)) {
            that.options.rightFixedIndex = -1;
            that.$rightFixedBox.html('');
        } else {
            that.options.rightFixedIndex = columns[i + 1].fieldIndex - 1;

            $rtrs.each(function () {
                $(this).find('th:lt(' + (i + 1) + ')').remove();
                $(this).height($(this).height());
            });

            that.$rightFixedHeaderColumns.html('').append($rtrs);
        }

    };

    /**
     * init the body
     */
    BootstrapTable.prototype.initBody = function () {
        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.fixedColumns) {
            return;
        }

        var that = this,
            columns = that.options.columns[0],
            columnsLen = columns.length,
            len = columns[(columnsLen -1)].fieldIndex,
            $bodyTrs = that.$body.find('> tr[data-index]');

        //get the left and right fixed table body data
        that.$leftFixedBodyColumns.html('');
        that.$rightFixedBodyColumns.html('');
        $bodyTrs.each(function (i) {
            var $tr = $(this).clone(),
                $tds = ($tr.find('td')).clone(),
                $rtds = $tds.clone();

            $tr.html('');
            var $rtr = $tr.clone();
            for (var i = 0; i < (that.options.leftFixedIndex + 1); i++) {
                $tr.append($tds.eq(i).clone());
            }

            for (var i = len; i > that.options.rightFixedIndex; i--) {
                $rtr.append($rtds.eq(i).clone());
            }

            that.$leftFixedBodyColumns.append($tr);
            that.$rightFixedBodyColumns.append($rtr);
        });
    };

    BootstrapTable.prototype.fitHeader = function () {
        _fitHeader.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.fixedColumns) {
            return;
        }
        var that = this,
            newFixedTableShowStatus = (parseInt(that.$tableBody.find('tr:eq(0)').width()) - parseInt(that.$tableContainer.width()))  > 0 ? 1 : 0;

        //if the table is wide enough, then hide the fixed table ,otherwise show
        if (that.options.fixedTableShowStatus != newFixedTableShowStatus) {
            clearTimeout(this.timeoutHeaderColumns_);
            this.timeoutHeaderColumns_ = setTimeout($.proxy(this.fitHeaderColumns, this), this.$el.is(':hidden') ? 100 : 0);

            clearTimeout(this.timeoutBodyColumns_);
            this.timeoutBodyColumns_ = setTimeout($.proxy(this.fitBodyColumns, this), this.$el.is(':hidden') ? 100 : 0);
        }

    };


    BootstrapTable.prototype.resetView = function () {
        _resetView.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.fixedColumns) {
            return;
        }

        clearTimeout(this.timeoutHeaderColumns_);
        this.timeoutHeaderColumns_ = setTimeout($.proxy(this.fitHeaderColumns, this), this.$el.is(':hidden') ? 100 : 0);

        clearTimeout(this.timeoutBodyColumns_);
        this.timeoutBodyColumns_ = setTimeout($.proxy(this.fitBodyColumns, this), this.$el.is(':hidden') ? 100 : 0);

    };

    BootstrapTable.prototype.fitHeaderColumns = function () {
        var that = this,
            visibleFields = this.getVisibleFields(),
            headerWidth = 0,
            headerHeight = 0,
            footerWidth = 0;

        this.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this),
                rWidth = that.$tableHeader.find('th:eq(' + i + ')').width(),
                rowspan = $this.attr("rowspan") || 1;

            if (i == 0) {
                headerHeight = that.$tableHeader.find('th:eq(' + i + ')').height();
            }

            if (i < that.options.leftFixedIndex + 1) {
                that.$leftFixedHeader.find('th[data-field="' + visibleFields[i] + '"]:first').height(headerHeight)
                    .find('.fht-cell').width(rWidth);
                headerWidth += $this.outerWidth();
            }

            if (i > that.options.rightFixedIndex) {
                that.$rightFixedHeader.find('th[data-field="' + visibleFields[i] + '"]:last').height(headerHeight)
                    .find('.fht-cell').width(rWidth);
                footerWidth += $this.outerWidth();
            }
        });

        this.$leftFixedHeader.width(headerWidth).show();
        this.$rightFixedHeader.width(footerWidth).show();

        //cause the page changes may make the vertical scrollbar showed or hidden.so keep changing
        that.$rightFixedBox.css("right", that.$tableHeader.css("margin-right"));
    };

    BootstrapTable.prototype.fitBodyColumns = function () {
        var that = this,
            top = -(parseInt(that.$el.css('margin-top'))),
            // the fixed height should reduce the scorll-x height
            height = this.$tableBody.height() - 16,
            allHeight = 0;

        if (!that.$body.find('> tr[data-index]').length) {
            that.$leftFixedBody.hide();
            return;
        }

        if (!that.options.height) {
            top = that.$leftFixedHeader.height();
            height = height - top;
        }

        that.$leftFixedBody.css({
            width: that.$leftFixedHeader.width(),
            height: height,
            top: top
        }).show();

        that.$rightFixedBody.css({
            width: that.$rightFixedHeader.width(),
            height: height,
            top: top
        }).show();

        //keep the body > tr (fixed table body or main table body) is absolutly same in height
        that.$body.find('> tr[data-index]').each(function (i) {
            var $this = $(this),
                $ltds = $this.find('td:lt(' + (that.options.leftFixedIndex + 1)  + ')'),
                $rtds = $this.find('td:gt(' + that.options.rightFixedIndex + ')'),
                bWidth = $this.find("td:eq(" + i +")").width();

            if (i == 0) {
                allHeight = $this.height();

                //set the left fixed width
                $.each($ltds, function(i) {
                    that.$leftFixedBody.find("td:eq(" + i + ")").width(bWidth);
                });

                //set the right fixed width
                $.each($rtds, function(i) {
                    that.$rightFixedBody.find("td:eq(" + i + ")").width(bWidth);
                });
            }
            that.$leftFixedBody.find('tr:eq(' + i + ')').height(allHeight);
            that.$rightFixedBody.find('tr:eq(' + i + ')').height(allHeight);
            //bug fix: the height of the main table' trs may have decimal number.but the fixed table get the height is int type. need be modified
            $this.height(allHeight);
        });

        // add events
        that.$tableBody.on('scroll', function () {
            var tHeight = -$(this).scrollTop();
            that.$leftFixedBodyColumnsTable.css('top', tHeight);
            that.$rightFixedBodyColumnsTable.css('top', tHeight);
        });
        that.$body.find('> tr[data-index]').off('hover').hover(function () {
            var index = $(this).data('index');
            that.$leftFixedBody.find('tr[data-index="' + index + '"]').addClass('trSelectSuccess');
            that.$rightFixedBody.find('tr[data-index="' + index + '"]').addClass('trSelectSuccess');
        }, function () {
            var index = $(this).data('index');
            that.$leftFixedBody.find('tr[data-index="' + index + '"]').removeClass('trSelectSuccess');
            that.$rightFixedBody.find('tr[data-index="' + index + '"]').removeClass('trSelectSuccess');
        });
        that.$leftFixedBody.find('tr[data-index]').off('hover').hover(function () {
            var index = $(this).data('index');
            that.$body.find('tr[data-index="' + index + '"]').addClass('trSelectSuccess');
            that.$rightFixedBody.find('tr[data-index="' + index + '"]').addClass('trSelectSuccess');
        }, function () {
            var index = $(this).data('index');
            that.$body.find('> tr[data-index="' + index + '"]').removeClass('trSelectSuccess');
            that.$rightFixedBody.find('tr[data-index="' + index + '"]').removeClass('trSelectSuccess');
        });
        that.$rightFixedBody.find('tr[data-index]').off('hover').hover(function () {
            var index = $(this).data('index');
            that.$body.find('tr[data-index="' + index + '"]').addClass('trSelectSuccess');
            that.$leftFixedBody.find('tr[data-index="' + index + '"]').addClass('trSelectSuccess');
        }, function () {
            var index = $(this).data('index');
            that.$body.find('> tr[data-index="' + index + '"]').removeClass('trSelectSuccess');
            that.$leftFixedBody.find('tr[data-index="' + index + '"]').removeClass('trSelectSuccess');
        });

        that.$body.find('> tr[data-index]').off('click');
        that.$leftFixedBody.find('tr[data-index]').off('click');
        that.$rightFixedBody.find('tr[data-index]').off('click');

        //todo: handle radio,checkbox events
        //thinking: remove the input and add the icons and bind the events
        // var inputLists = that.$leftFixedBodyColumns.find("input[name='" + that.options.selectItemName + "']"),
        //     inputListsLen = inputLists.length;

        // if (inputListsLen > 0) {
        // }

        //margin-right can make sure that the main table have horizontal scrollbar, WHEN yes, show fixed table ,otherwise hide they.

        var newFixedTableShowStatus = (parseInt(that.$tableBody.find('tr:eq(0)').width()) - parseInt(that.$tableContainer.width()))  > 0 ? 1 : 0;

        if (that.options.fixedTableShowStatus != newFixedTableShowStatus) {
            if (newFixedTableShowStatus == 1) {
                that.$leftFixedBox.show();
                that.$rightFixedBox.show();
            } else {
                that.$leftFixedBox.hide();
                that.$rightFixedBox.hide();
            }
            that.options.fixedTableShowStatus = newFixedTableShowStatus
        }
    };

    /**
     * 合并列
     */
    BootstrapTable.prototype.mergeCells = function () {
        var optionsArr = Array.prototype.slice.apply(arguments);
        _mergeCells.apply(this, optionsArr);

        if (!this.options.fixedColumns && this.options.leftFixedFields.length > 0) {
            return;
        }

        var that = this,
            options  = optionsArr[0],
            row  = options.index,
            col = $.inArray(options.field, this.getVisibleFields()),
            rowspan = options.rowspan || 1,
            colspan = options.colspan || 1,
            i, j, $tr, $td;

        if ($.inArray(options.field, that.options.leftFixedFields) > -1) {
            $tr = that.$leftFixedBodyColumns.find('>tr');
            if (this.options.detailView && !this.options.cardView) {
                col += 1;
            }

            $td = $tr.eq(row).find('>td').eq(col);
            if (row < 0 || col < 0 || row >= this.data.length) {
                return;
            }
            for (i = row; i < row + rowspan; i++) {
                for (j = col; j < col + colspan; j++) {
                    $tr.eq(i).find('>td').eq(j).hide();
                }
            }

            $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
        }
    }

})(jQuery);