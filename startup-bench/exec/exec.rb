r, w = IO.pipe
pid = spawn("bash", "-c", "echo Hi", :out=>w)
_, code = Process.wait2 pid
w.close
print "#{code.exitstatus} #{r.read}"
