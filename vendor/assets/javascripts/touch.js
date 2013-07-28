window.touch = function Touch(obj, params)
    {
        function move(e)
        {
            if (e.x - this.lastX !== 0 || e.y - this.lastY !== 0)
            {
                if (params.onMove)
                {
                    if (e.distanceX !== 0 || e.distanceY !== 0)
                    {
                        this.moved = true;
                        e.moved = this.moved;
                    }

                    e.xFromTopLeft = this.xFromTopLeft;
                    e.yFromTopLeft = this.yFromTopLeft;

                    if (params.onMove)
                    {
                        var handled = false;
                        handled = params.onMove.call(this, e);

                        if (handled)
                        {
                            e.stopPropagation();
                        }
                    }
                }
            }
        }

        function end(e)
        {
            var now = (new Date()).getTime();
            var lastTouch = this.lastTouch || now;
            var delta = Math.max(0, now - lastTouch);

            if(!this.numClicks)
                this.numClicks = 1;
            else
                this.numClicks ++;

            e.x = this.lastX;
            e.y = this.lastY;
            e.moved = this.moved;
            e.timeDelta = delta;
            e.diffX = (this.lastX - this.startX);
            e.diffY = (this.lastY - this.startY);
            e.startX = this.startX;
            e.startY = this.startY;
            e.xFromTopLeft = this.xFromTopLeft;
            e.yFromTopLeft = this.yFromTopLeft;
            e.startSrc = this.startSrc;

            if(isNaN(e.button) || e.button === 0)
            {
                this.lastTouch = now;
                if (params.onClick && !this.moved)
                    params.onClick.call(this, e);
            }

            if (params.onEnd)
            {
                params.onEnd.call(this, e);
            }
        }

        function start(e) {
            this.startSrc = e.target;
            this.moved = false;
            e.startX = this.startX = e.x;
            e.startY = this.startY = e.y;
            this.lastX = e.x;
            this.lastY = e.y;

            var offset = e.target.getBoundingClientRect();
            e.xFromTopLeft = this.xFromTopLeft = e.x - offset.left;
            e.yFromTopLeft = this.yFromTopLeft = e.y - offset.top;

            if (params.onStart)
                params.onStart.call(this, e);
        }
        //
        // Touch Passthrough Handlers
        //

        function touchMove(e) {
            e.x = e.touches[0].pageX;
            e.y = e.touches[0].pageY;
            move.call(obj, e);
            if(e.returnFalse)
                return false;
        }

        function touchUp(e) {
            document.body.removeEventListener('touchmove', touchMove);
            document.body.removeEventListener('touchend', touchUp);
            end.call(obj, e);
            if(e.returnFalse)
                return false;
        }

        function touchStart(e) {
            if (e.handled) return;
            e.x = e.touches[0].pageX;
            e.y = e.touches[0].pageY;
            start.call(obj, e);
            if (!e.ignore) {

                document.body.addEventListener('touchmove', touchMove);
                document.body.addEventListener('touchend', touchUp);
            }
            if(e.returnFalse)
                return false;
        }

        //
        // Mouse Passthrough Handlers
        //

        function mouseMove(e)
        {
            e.x = e.pageX;
            e.y = e.pageY;
            move.call(obj, e);
            if(e.returnFalse)
                return false;
        }

        function mouseUp(e)
        {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            end.call(obj, e);
            if(e.returnFalse)
                return false;
        }

        function mousedown(e)
        {
            if (e.handled) return;
            if (!e.button == 0) return;

            e.x = e.pageX;
            e.y = e.pageY;
            start.call(obj, e);

            if (!e.ignore)
            {
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('mouseup', mouseUp);
            }
            if(e.returnFalse)
                return false;
        }

        // Unwrap the jQuery element or use the passed in DOM element directly
        var element = obj.jquery ? obj[0] : obj;
        if ('ontouchstart' in window)
        {
            element.ontouchstart = touchStart;
        }
        else
        {
            element.onmousedown = mousedown;
            if(params.onContextMenu)
            {
                element.oncontextmenu = right;
            }
        }

        return this;
    }